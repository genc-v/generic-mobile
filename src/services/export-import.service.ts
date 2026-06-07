import * as SecureStore from 'expo-secure-store';
import { File, UploadType } from 'expo-file-system';
import { authService, SECURE_STORE_KEYS } from './auth.service';

const ORG_BASE = process.env.EXPO_PUBLIC_ORG_API_URL ?? 'https://organisations.jonfjz.dev';
const CONTENT_BASE = process.env.EXPO_PUBLIC_CONTENT_API_URL ?? 'https://content.jonfjz.dev';

export type ExportFormat = 'json' | 'csv' | 'excel';

async function authHeaders(): Promise<Record<string, string>> {
  await authService.checkAndRefreshJwt();
  const token = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  return token ? { Authorization: `Bearer ${token}`, accept: '*/*' } : { accept: '*/*' };
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export interface DownloadDescriptor {
  url: string;
  headers: Record<string, string>;
  filename: string;
}

function fileExt(format: ExportFormat) {
  if (format === 'csv') return 'csv';
  if (format === 'excel') return 'xlsx';
  return 'json';
}

async function buildDescriptor(url: string, format: ExportFormat, basename: string): Promise<DownloadDescriptor> {
  const headers = await authHeaders();
  return { url: `${url}?format=${format}`, headers, filename: `${basename}.${fileExt(format)}` };
}

export const exportImportService = {
  exportOrgs(format: ExportFormat): Promise<DownloadDescriptor> {
    return buildDescriptor(`${ORG_BASE}/organisations/export`, format, 'organisations');
  },

  exportMembers(orgId: string, format: ExportFormat): Promise<DownloadDescriptor> {
    return buildDescriptor(`${ORG_BASE}/organisations/${orgId}/members/export`, format, 'members');
  },

  exportEntries(orgId: string, format: ExportFormat): Promise<DownloadDescriptor> {
    return buildDescriptor(`${CONTENT_BASE}/${orgId}/entry/export`, format, 'entries');
  },

  exportCategories(orgId: string, format: ExportFormat): Promise<DownloadDescriptor> {
    return buildDescriptor(`${CONTENT_BASE}/${orgId}/category/export`, format, 'categories');
  },

  exportTags(orgId: string, format: ExportFormat): Promise<DownloadDescriptor> {
    return buildDescriptor(`${CONTENT_BASE}/${orgId}/tag/export`, format, 'tags');
  },

  async importEntries(
    orgId: string,
    fileUri: string,
    mimeType: string,
  ): Promise<ImportResult> {
    await authService.checkAndRefreshJwt();
    const token = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);

    const file = new File(fileUri);
    const result = await file.upload(`${CONTENT_BASE}/${orgId}/entry/import`, {
      uploadType: UploadType.MULTIPART,
      fieldName: 'file',
      mimeType,
      headers: { Authorization: `Bearer ${token ?? ''}` },
    });

    if (result.status < 200 || result.status >= 300) {
      throw new Error(result.body || `Import failed (${result.status})`);
    }
    return JSON.parse(result.body) as ImportResult;
  },
};
