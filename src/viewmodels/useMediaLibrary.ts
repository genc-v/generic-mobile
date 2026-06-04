import { useState, useEffect, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { assetService } from '../services/asset.service';
import { confirm } from '../utils/confirm';
import { AssetItem } from '../types/asset.types';

export function useMediaLibrary(orgId: string, enabled = true) {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [selected, setSelected] = useState<AssetItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.list(orgId);
      setAssets(data);
    } catch (e: any) {
      console.error('[media.list] failed', e);
      setError(e?.message ?? 'Failed to load media.');
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [orgId]);

  // Lazily load the first time the Media tab becomes active.
  useEffect(() => {
    if (enabled && !hasLoaded) fetchAssets();
  }, [enabled, hasLoaded, fetchAssets]);

  async function openDetail(asset: AssetItem) {
    setSelected(asset);
    setShowDetail(true);
    setLoadingDetail(true);
    try {
      const detail = await assetService.getInfo(orgId, asset.key);
      // Keep the list-derived url/name if the info call doesn't supply them.
      setSelected({ ...asset, ...detail, url: detail.url || asset.url, name: detail.name || asset.name });
    } catch {
      // Detail enrichment is best-effort; the list row already has the basics.
    } finally {
      setLoadingDetail(false);
    }
  }

  function closeDetail() {
    setShowDetail(false);
    setSelected(null);
    setCopied(false);
  }

  async function copyUrl(url: string) {
    await Clipboard.setStringAsync(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleUpload() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const name = asset.fileName ?? `upload-${Date.now()}.jpg`;
    const type = asset.mimeType ?? 'image/jpeg';

    setUploading(true);
    setError(null);
    try {
      await assetService.upload(orgId, '', { uri: asset.uri, name, type });
      await fetchAssets();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to upload asset.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(key: string) {
    const name = assets.find(a => a.key === key)?.name ?? selected?.name ?? 'this asset';
    const ok = await confirm({
      title: 'Delete asset',
      message: `Delete "${name}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    setDeleting(true);
    setError(null);
    try {
      await assetService.remove(orgId, key);
      setAssets(prev => prev.filter(a => a.key !== key));
      closeDetail();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete asset.');
    } finally {
      setDeleting(false);
    }
  }

  return {
    assets, loading, error,
    selected, showDetail, loadingDetail,
    uploading, deleting, copied,
    fetchAssets,
    openDetail, closeDetail,
    copyUrl, handleUpload, handleDelete,
  };
}
