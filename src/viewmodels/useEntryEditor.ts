import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { contentService } from '../services/content.service';
import { ContentDTO } from '../types/content.types';

export function useEntryEditor(orgId: string, entryId: string) {
  const router = useRouter();
  const [entry, setEntry] = useState<ContentDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [richContent, setRichContent] = useState('');

  useEffect(() => {
    contentService.getEntry(orgId, entryId)
      .then(data => {
        setEntry(data);
        setTitle(data.title ?? '');
        setRichContent(data.richContent ?? '');
      })
      .catch(() => setError('Failed to load entry.'))
      .finally(() => setLoading(false));
  }, [orgId, entryId]);

  async function handleSaveDraft() {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await contentService.saveEntry(orgId, entryId, {
        title,
        richContent,
        categoryId: entry?.categoryId ?? undefined,
        categoryName: entry?.categoryName ?? undefined,
        tags: entry?.tags ?? [],
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setError('Failed to save entry.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setSaving(true);
    setError(null);
    try {
      await contentService.saveEntry(orgId, entryId, {
        title,
        richContent,
        categoryId: entry?.categoryId ?? undefined,
        categoryName: entry?.categoryName ?? undefined,
        tags: entry?.tags ?? [],
      });
      setEntry(prev => prev ? { ...prev, status: 'Published' } : prev);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setError('Failed to publish entry.');
    } finally {
      setSaving(false);
    }
  }

  function goBack() {
    router.back();
  }

  return {
    entry, loading, saving, error, saveSuccess,
    title, setTitle,
    richContent, setRichContent,
    handleSaveDraft, handlePublish, goBack,
  };
}
