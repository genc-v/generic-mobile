import { useState, useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  exportImportService,
  ExportFormat,
  DownloadDescriptor,
  ImportResult,
} from '../services/export-import.service';
import { toast } from '../utils/toast';

interface ExportState {
  loading: boolean;
  done: boolean;
  error: string | null;
}

function blank(): ExportState {
  return { loading: false, done: false, error: null };
}

async function downloadAndShare({ url, headers, filename }: DownloadDescriptor) {
  const dest = new File(Paths.cache, filename);
  const downloaded = await File.downloadFileAsync(url, dest, { headers, idempotent: true });
  await Sharing.shareAsync(downloaded.uri);
}

export function useExportImport(orgId: string) {
  const [format, setFormat] = useState<ExportFormat>('json');

  const [orgsState, setOrgsState] = useState<ExportState>(blank());
  const [membersState, setMembersState] = useState<ExportState>(blank());
  const [entriesState, setEntriesState] = useState<ExportState>(blank());
  const [categoriesState, setCategoriesState] = useState<ExportState>(blank());
  const [tagsState, setTagsState] = useState<ExportState>(blank());

  const [importFile, setImportFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  async function runExport(
    setter: React.Dispatch<React.SetStateAction<ExportState>>,
    fetcher: (fmt: ExportFormat) => Promise<DownloadDescriptor>,
    currentFormat: ExportFormat,
  ) {
    setter({ loading: true, done: false, error: null });
    try {
      const descriptor = await fetcher(currentFormat);
      await downloadAndShare(descriptor);
      setter({ loading: false, done: true, error: null });
    } catch (e: any) {
      setter({ loading: false, done: false, error: e?.message ?? 'Export failed' });
    }
  }

  const exportOrgs = useCallback(
    (fmt: ExportFormat) => runExport(setOrgsState, (f) => exportImportService.exportOrgs(f), fmt),
    [],
  );

  const exportMembers = useCallback(
    (fmt: ExportFormat) => runExport(setMembersState, (f) => exportImportService.exportMembers(orgId, f), fmt),
    [orgId],
  );

  const exportEntries = useCallback(
    (fmt: ExportFormat) => runExport(setEntriesState, (f) => exportImportService.exportEntries(orgId, f), fmt),
    [orgId],
  );

  const exportCategories = useCallback(
    (fmt: ExportFormat) => runExport(setCategoriesState, (f) => exportImportService.exportCategories(orgId, f), fmt),
    [orgId],
  );

  const exportTags = useCallback(
    (fmt: ExportFormat) => runExport(setTagsState, (f) => exportImportService.exportTags(orgId, f), fmt),
    [orgId],
  );

  async function pickFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/json',
          'text/csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      setImportFile({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType ?? 'application/octet-stream',
      });
      setImportResult(null);
      setImportError(null);
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not open file picker');
    }
  }

  async function doImport() {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    setImportError(null);
    try {
      const result = await exportImportService.importEntries(
        orgId,
        importFile.uri,
        importFile.mimeType,
      );
      setImportResult(result);
      toast.success(`Imported ${result.imported} entr${result.imported === 1 ? 'y' : 'ies'}`);
    } catch (e: any) {
      setImportError(e?.message ?? 'Import failed');
    } finally {
      setImporting(false);
    }
  }

  function clearImport() {
    setImportFile(null);
    setImportResult(null);
    setImportError(null);
  }

  return {
    format, setFormat,
    orgsState, exportOrgs,
    membersState, exportMembers,
    entriesState, exportEntries,
    categoriesState, exportCategories,
    tagsState, exportTags,
    importFile, pickFile, clearImport,
    importing, importResult, importError, doImport,
  };
}
