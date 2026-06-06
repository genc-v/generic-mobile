import { useState, useEffect } from 'react';
import { contentService } from '../services/content.service';
import { confirm } from '../utils/confirm';
import { toast } from '../utils/toast';
import { TagDTO } from '../types/content.types';

type Args = {
  visible: boolean;
  orgId: string;
  editing: TagDTO | null;
  onSaved: (isNew: boolean, tagId: string, name: string) => void;
  onDeleted: (tagId: string) => void;
};

export function useTagForm({ visible, orgId, editing, onSaved, onDeleted }: Args) {
  const isNew = editing === null;

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName(editing?.name ?? '');
      setError(null);
    }
  }, [visible, editing]);

  async function handleSave() {
    if (!name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const result = await contentService.createTag(orgId, name.trim());
        onSaved(true, result.tagId, result.name);
      } else {
        await contentService.updateTag(orgId, { tagId: editing!.tagId, name: name.trim() });
        onSaved(false, editing!.tagId, name.trim());
      }
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to save tag.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editing) return;
    const ok = await confirm({
      title: 'Delete tag',
      message: `Delete the "${editing.name}" tag? This cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await contentService.deleteTag(orgId, editing.tagId);
      onDeleted(editing.tagId);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to delete tag.');
    } finally {
      setDeleting(false);
    }
  }

  return {
    isNew,
    name, setName,
    saving, deleting, error,
    handleSave, handleDelete,
  };
}
