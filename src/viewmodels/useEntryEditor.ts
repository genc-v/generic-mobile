import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { contentService } from '../services/content.service';
import { assetService } from '../services/asset.service';
import { ContentDTO, TagDTO } from '../types/content.types';

export function useEntryEditor(orgId: string, entryId: string) {
  const router = useRouter();
  const [entry, setEntry] = useState<ContentDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [richContent, setRichContent] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);

  useEffect(() => {
    contentService.getEntry(orgId, entryId)
      .then(data => {
        setEntry(data);
        setTitle(data.title ?? '');
        setRichContent(data.richContent ?? '');
        setCategoryId(data.categoryId);
        setCategoryName(data.categoryName);
        setTags(data.tags ?? []);
        setAssetUrl(data.assetUrl);
      })
      .catch(() => setError('Failed to load entry.'))
      .finally(() => setLoading(false));
  }, [orgId, entryId]);

  function buildPayload() {
    return {
      title,
      richContent,
      assetUrl: assetUrl ?? undefined,
      categoryId: categoryId ?? undefined,
      categoryName: categoryName ?? undefined,
      tags,
    };
  }

  function clearAsset() {
    setAssetUrl(null);
  }

  async function handlePickAsset() {
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
      const uploaded = await assetService.upload(orgId, entryId, { uri: asset.uri, name, type });
      setAssetUrl(uploaded.url);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to upload asset.');
    } finally {
      setUploading(false);
    }
  }

  // Wrap the current selection with prefix/suffix, or insert markers at the cursor.
  function wrapSelection(prefix: string, suffix = prefix) {
    const { start, end } = selection;
    const before = richContent.slice(0, start);
    const selected = richContent.slice(start, end);
    const after = richContent.slice(end);
    const inner = selected || 'text';
    const next = `${before}${prefix}${inner}${suffix}${after}`;
    setRichContent(next);
    const cursor = start + prefix.length + inner.length;
    setSelection({ start: start + prefix.length, end: cursor });
  }

  // Insert a prefix at the start of the line the cursor is on (headings, lists, quotes).
  function prefixLine(marker: string) {
    const { start } = selection;
    const lineStart = richContent.lastIndexOf('\n', start - 1) + 1;
    const next = richContent.slice(0, lineStart) + marker + richContent.slice(lineStart);
    setRichContent(next);
    const moved = start + marker.length;
    setSelection({ start: moved, end: moved });
  }

  // Insert raw text at the cursor (e.g. link / divider snippets).
  function insertAtCursor(snippet: string, cursorOffset?: number) {
    const { start, end } = selection;
    const next = richContent.slice(0, start) + snippet + richContent.slice(end);
    setRichContent(next);
    const pos = start + (cursorOffset ?? snippet.length);
    setSelection({ start: pos, end: pos });
  }

  async function searchCategories(q: string) {
    const cats = await contentService.listCategories(orgId, q || undefined);
    return cats.map(c => ({ id: c.categoryId, name: c.name ?? '' }));
  }

  async function searchTags(q: string) {
    const found = await contentService.listTags(orgId, q || undefined);
    return found.map(t => ({ id: t.tagId, name: t.name ?? '' }));
  }

  function selectCategory(id: string, name: string) {
    setCategoryId(id);
    setCategoryName(name);
    setShowCategoryPicker(false);
  }

  function clearCategory() {
    setCategoryId(null);
    setCategoryName(null);
  }

  function toggleTag(tag: TagDTO) {
    setTags(prev =>
      prev.some(t => t.tagId === tag.tagId)
        ? prev.filter(t => t.tagId !== tag.tagId)
        : [...prev, tag]
    );
  }

  function removeTag(tagId: string) {
    setTags(prev => prev.filter(t => t.tagId !== tagId));
  }

  async function save(publishedStatus?: string) {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await contentService.saveEntry(orgId, entryId, buildPayload());
      if (publishedStatus) {
        setEntry(prev => prev ? { ...prev, status: publishedStatus } : prev);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setError('Failed to save entry.');
    } finally {
      setSaving(false);
    }
  }

  function handleSaveDraft() {
    return save();
  }

  function handlePublish() {
    return save('Published');
  }

  async function handleUnpublish() {
    setUnpublishing(true);
    setError(null);
    try {
      await contentService.unpublish(orgId, entryId);
      setEntry(prev => prev ? { ...prev, status: 'Unpublished' } : prev);
    } catch {
      setError('Failed to unpublish entry.');
    } finally {
      setUnpublishing(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await contentService.deleteEntry(orgId, entryId);
      router.back();
    } catch {
      setError('Failed to delete entry.');
      setDeleting(false);
    }
  }

  function goBack() {
    router.back();
  }

  const isPublished = entry?.status === 'Published';

  // A piece of content can only be published once everything is filled in.
  const missingForPublish: string[] = [];
  if (!title.trim()) missingForPublish.push('title');
  if (!richContent.trim()) missingForPublish.push('content');
  if (!categoryId) missingForPublish.push('category');
  if (!assetUrl) missingForPublish.push('image');
  const canPublish = missingForPublish.length === 0;

  return {
    entry, loading, saving, deleting, unpublishing, uploading, error, saveSuccess,
    title, setTitle,
    richContent, setRichContent,
    selection, setSelection,
    wrapSelection, prefixLine, insertAtCursor,
    categoryId, categoryName,
    tags,
    assetUrl,
    isPublished,
    canPublish,
    missingForPublish,
    showCategoryPicker, setShowCategoryPicker,
    showTagPicker, setShowTagPicker,
    searchCategories, searchTags,
    selectCategory, clearCategory,
    toggleTag, removeTag,
    handlePickAsset, clearAsset,
    handleSaveDraft, handlePublish, handleUnpublish, handleDelete, goBack,
  };
}
