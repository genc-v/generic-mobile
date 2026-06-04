import { useState, useEffect, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import { organisationService } from '../services/organisation.service';
import { confirm } from '../utils/confirm';
import { ApiKey } from '../types/organisation.types';

export type ExpiryOption = 'none' | '30d' | '90d' | '1y';

function expiryOptionToDate(option: ExpiryOption): string | undefined {
  if (option === 'none') return undefined;
  const d = new Date();
  if (option === '30d') d.setDate(d.getDate() + 30);
  if (option === '90d') d.setDate(d.getDate() + 90);
  if (option === '1y') d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

export function useApiKeys(orgId: string) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showGenerate, setShowGenerate] = useState(false);
  const [expiry, setExpiry] = useState<ExpiryOption>('none');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await organisationService.listApiKeys(orgId);
      setKeys(data);
    } catch {
      setError('Failed to load API keys.');
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError(null);
    try {
      const expiresAt = expiryOptionToDate(expiry);
      const key = await organisationService.createApiKey(orgId, expiresAt);
      setKeys(prev => [key, ...prev]);
      setShowGenerate(false);
      setNewKey(key);
      setExpiry('none');
    } catch {
      setGenerateError('Failed to generate key. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleToggle(keyId: string) {
    // Disabling a key is disruptive — confirm before revoking access.
    if (keys.find(k => k.id === keyId)?.isActive) {
      const ok = await confirm({
        title: 'Disable API key',
        message: 'Disable this API key? Any apps using it will stop working until it is re-enabled.',
        confirmLabel: 'Disable',
        destructive: true,
      });
      if (!ok) return;
    }
    setTogglingId(keyId);
    try {
      await organisationService.toggleApiKey(orgId, keyId);
      setKeys(prev => prev.map(k => k.id === keyId ? { ...k, isActive: !k.isActive } : k));
    } catch {
      setError('Failed to toggle key.');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(keyId: string) {
    const ok = await confirm({
      title: 'Delete API key',
      message: 'Permanently delete this API key? Any apps using it will stop working. This cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    setDeletingId(keyId);
    try {
      await organisationService.deleteApiKey(orgId, keyId);
      setKeys(prev => prev.filter(k => k.id !== keyId));
    } catch {
      setError('Failed to delete key.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopyKey() {
    if (!newKey) return;
    await Clipboard.setStringAsync(newKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function dismissReveal() {
    setNewKey(null);
    setCopied(false);
  }

  return {
    keys, loading, error, fetch,
    showGenerate, setShowGenerate,
    expiry, setExpiry,
    generating, generateError,
    newKey, copied,
    togglingId, deletingId,
    handleGenerate, handleToggle, handleDelete,
    handleCopyKey, dismissReveal,
  };
}
