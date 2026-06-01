import * as SecureStore from 'expo-secure-store';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';
import { authService, SECURE_STORE_KEYS } from './auth.service';

const ASSET_BASE_URL = process.env.EXPO_PUBLIC_ASSET_API_URL ?? 'https://nest.jonfjz.dev';

export interface UploadedAsset {
  url: string;
  fileName: string;
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
};
