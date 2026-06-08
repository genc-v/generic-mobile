import { useState, useEffect, useRef } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { contentService } from '../services/content.service';
import { assetService } from '../services/asset.service';
import { orgMembersService } from '../services/org-members.service';
import { confirm } from '../utils/confirm';
import { toast } from '../utils/toast';
import { ContentDTO, TagDTO } from '../types/content.types';
import { UserPublicProfile } from '../types/org-members.types';

const AUTOSAVE_DELAY = 1000;

export function useEntryEditor(orgId: string, entryId: string) {
  const router = useRouter();
  const [entry, setEntry] = useState<ContentDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autosaving, setAutosaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Signature of the last persisted state — lets autosave skip the initial
  // hydration and no-op edits. `null` until the entry has loaded.
  const lastSavedSig = useRef<string | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [title, setTitle] = useState('');
  const [richContent, setRichContent] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<UserPublicProfile | null>(null);

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
        lastSavedSig.current = sigOf(
          data.title ?? '', data.richContent ?? '', data.categoryId, data.assetUrl, data.tags ?? [],
        );
        if (data.userId) {
          orgMembersService.getProfiles([data.userId])
            .then(profiles => setAuthorProfile(profiles[0] ?? null))
            .catch(() => {});
        }
      })
      .catch(() => toast.error('Failed to load entry.'))
      .finally(() => setLoading(false));
  }, [orgId, entryId]);

  function sigOf(t: string, rc: string, cat: string | null, asset: string | null, tg: TagDTO[]) {
    return JSON.stringify({
      t, rc,
      cat: cat ?? null,
      asset: asset ?? null,
      tags: tg.map(x => x.tagId).sort(),
    });
  }

  function currentSig() {
    return sigOf(title, richContent, categoryId, assetUrl, tags);
  }

  // Debounced background save: whenever a field changes after hydration, save
  // silently and refresh the entry so the status pill and slug stay accurate.
  useEffect(() => {
    if (lastSavedSig.current === null) return;       // not loaded yet
    if (currentSig() === lastSavedSig.current) return; // nothing changed
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => { persist(true); }, AUTOSAVE_DELAY);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, richContent, categoryId, assetUrl, tags]);

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

  function handlePickAsset() {
    const options = ['Choose from library', 'Upload new image', 'Cancel'];
    const cancelIndex = 2;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: cancelIndex },
        i => {
          if (i === 0) setShowMediaPicker(true);
          else if (i === 1) uploadFromDevice();
        },
      );
    } else {
      Alert.alert('Set image', undefined, [
        { text: 'Choose from library', onPress: () => setShowMediaPicker(true) },
        { text: 'Upload new image', onPress: uploadFromDevice },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }

  function handleSelectFromLibrary(url: string) {
    setAssetUrl(url);
    setShowMediaPicker(false);
  }

  async function uploadFromDevice() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const name = asset.fileName ?? `upload-${Date.now()}.jpg`;
    const type = asset.mimeType ?? 'image/jpeg';

    setUploading(true);
    try {
      const uploaded = await assetService.upload(orgId, entryId, { uri: asset.uri, name, type });
      setAssetUrl(uploaded.url);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to upload the image.');
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

  // Core save. `silent` is used by autosave (no spinner/toast). The server
  // recalculates status and generates the slug, so we refetch afterwards.
  async function persist(silent: boolean) {
    const sig = currentSig();
    if (silent) setAutosaving(true); else { setSaving(true); setSaveSuccess(false); }
    try {
      await contentService.saveEntry(orgId, entryId, buildPayload());
      lastSavedSig.current = sig;
      try {
        const fresh = await contentService.getEntry(orgId, entryId);
        setEntry(fresh); // refreshes status + slug; field state is left as the user has it
      } catch {
        // Refresh is best-effort — the save itself already succeeded.
      }
      if (!silent) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to save entry.');
    } finally {
      if (silent) setAutosaving(false); else setSaving(false);
    }
  }

  function handleSaveDraft() {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    return persist(false);
  }

  function handlePublish() {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    return persist(false);
  }

  async function handleUnpublish() {
    setUnpublishing(true);
    try {
      await contentService.unpublish(orgId, entryId);
      setEntry(prev => prev ? { ...prev, status: 'Unpublished' } : prev);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to unpublish entry.');
    } finally {
      setUnpublishing(false);
    }
  }

  async function handleDelete() {
    const ok = await confirm({
      title: 'Delete entry',
      message: `Permanently delete ${entry?.title ? `"${entry.title}"` : 'this entry'}? This cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await contentService.deleteEntry(orgId, entryId);
      router.back();
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to delete entry.');
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
    entry, loading, saving, autosaving, deleting, unpublishing, uploading, saveSuccess,
    authorProfile,
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
    showMediaPicker, closeMediaPicker: () => setShowMediaPicker(false),
    handlePickAsset, handleSelectFromLibrary, clearAsset,
    handleSaveDraft, handlePublish, handleUnpublish, handleDelete, goBack,
  };
}
