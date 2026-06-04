import * as SecureStore from 'expo-secure-store';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';
import { authService, SECURE_STORE_KEYS } from './auth.service';
import { AssetItem } from '../types/asset.types';

const ASSET_BASE_URL = process.env.EXPO_PUBLIC_ASSET_API_URL ?? 'https://nest.jonfjz.dev';

export interface UploadedAsset {
  url: string;
  fileName: string;
}

const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'heic', 'heif', 'avif']);

function basename(key: string): string {
  const clean = key.split('?')[0].replace(/\/+$/, '');
  return clean.split('/').pop() ?? clean;
}

function extOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** Build the public preview URL served by the asset microservice from a key. */
function publicUrl(key: string): string {
  if (/^https?:\/\//i.test(key)) return key;
  return `${ASSET_BASE_URL}/uploads/${key.replace(/^\/+/, '')}`;
}

/** Normalise one raw list/info entry (field names vary) into an AssetItem. */
function toAssetItem(raw: any): AssetItem {
  // A bare string response is just the key.
  if (typeof raw === 'string') raw = { key: raw };

  const key: string =
    raw.key ?? raw.Key ?? raw.name ?? raw.Name ?? raw.objectName ?? raw.path ?? '';
  const rawUrl: string | undefined = raw.url ?? raw.publicUrl ?? raw.location;
  const metadata: Record<string, string> | undefined =
    raw.metadata ?? raw.metaData ?? raw.tags ?? undefined;
  const name = basename(raw.fileName ?? raw.filename ?? key);
  const ext = extOf(name);
  const contentType: string | undefined = raw.contentType ?? raw.mimeType ?? raw.mime;
  const isImage = IMAGE_EXT.has(ext) || (contentType?.startsWith('image/') ?? false);

  return {
    key,
    name,
    url: rawUrl ?? publicUrl(key),
    ext,
    isImage,
    size: raw.size ?? raw.Size,
    lastModified: raw.lastModified ?? raw.LastModified ?? raw.updatedAt ?? raw.uploadedAt,
    contentType,
    entryId: raw.entryId,
    metadata,
  };
}

/** Authenticated JSON request against the asset microservice. */
async function assetRequest<T = any>(
  path: string,
  method: 'GET' | 'DELETE' | 'PATCH' = 'GET',
  body?: any,
): Promise<T> {
  await authService.checkAndRefreshJwt();
  const jwtToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  const headers: Record<string, string> = {
    accept: '*/*',
    ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${ASSET_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Request failed with status ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

/**
 * Uploads a file to the asset microservice for a given entry.
 *
 * Uses Expo FileSystem's native multipart uploader rather than fetch + FormData.
 * React Native's FormData rejects the `{ uri, name, type }` file part on newer
 * versions ("unsupported FormDataPart implementation"); the native uploader
 * encodes the multipart body correctly from the local file URI.
 */
export const assetService = {
  async upload(
    orgId: string,
    entryId: string,
    file: { uri: string; name: string; type: string },
  ): Promise<UploadedAsset> {
    // Mirror executeApiRequest: ensure the JWT is fresh before the asset
    // service forwards it to the organisation service for access verification.
    await authService.checkAndRefreshJwt();
    const jwtToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
    const endpoint = `${ASSET_BASE_URL}/organisations/${orgId}/upload`;

    let result;
    try {
      result = await uploadAsync(endpoint, file.uri, {
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        mimeType: file.type,
        parameters: { entryId },
        headers: {
          accept: '*/*',
          ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        },
      });
    } catch (e: any) {
      console.error('[asset.upload] network error', e);
      throw new Error(`Network error reaching ${endpoint}: ${e?.message ?? e}`);
    }

    if (result.status < 200 || result.status >= 300) {
      console.error('[asset.upload] failed', result.status, result.body);
      throw new Error(`Upload failed (${result.status}): ${(result.body ?? '').slice(0, 200)}`);
    }

    // Response shape isn't strictly defined — accept a raw URL string or an object.
    const text = (result.body ?? '').trim();
    let assetUrl = text;
    try {
      const json = JSON.parse(text);
      assetUrl = json.url ?? json.assetUrl ?? json.location ?? json.path ?? text;
    } catch {
      assetUrl = text.replace(/^"|"$/g, '');
    }

    console.log('[asset.upload] success', assetUrl);
    return { url: assetUrl, fileName: file.name };
  },

  /**
   * Lists assets for an organisation. Pass `entryId` to scope to a single
   * entry, or omit it for the whole media library.
   */
  async list(orgId: string, entryId?: string): Promise<AssetItem[]> {
    const qs = entryId ? `?entryId=${encodeURIComponent(entryId)}` : '';
    const result = await assetRequest<any>(`/organisations/${orgId}/assets${qs}`);
    const arr = Array.isArray(result)
      ? result
      : Array.isArray(result?.items)
        ? result.items
        : Array.isArray(result?.assets)
          ? result.assets
          : Array.isArray(result?.data)
            ? result.data
            : [];
    return arr.map(toAssetItem).filter((a: AssetItem) => a.key);
  },

  /** Fetches metadata for a single asset by its storage key. */
  async getInfo(orgId: string, key: string): Promise<AssetItem> {
    const result = await assetRequest<any>(
      `/organisations/${orgId}/assets/info?key=${encodeURIComponent(key)}`,
    );
    // Merge the requested key back in: the info payload may omit it.
    return toAssetItem({ key, ...(typeof result === 'object' ? result : {}) });
  },

  /** Deletes an asset by its storage key. */
  async remove(orgId: string, key: string): Promise<void> {
    await assetRequest(
      `/organisations/${orgId}/assets?key=${encodeURIComponent(key)}`,
      'DELETE',
    );
  },

  /** Updates the key-value tag metadata on an asset. */
  async updateMetadata(orgId: string, key: string, tags: Record<string, string>): Promise<void> {
    await assetRequest(
      `/organisations/${orgId}/assets/metadata?key=${encodeURIComponent(key)}`,
      'PATCH',
      { tags },
    );
  },
};
