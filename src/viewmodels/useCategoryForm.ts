import { useState, useEffect } from 'react';
import { contentService } from '../services/content.service';
import { confirm } from '../utils/confirm';
import { toast } from '../utils/toast';
import { CategoryDetail } from '../types/content.types';

type Args = {
  visible: boolean;
  orgId: string;
  editing: CategoryDetail | null;
  onSaved: (isNew: boolean, result: CategoryDetail) => void;
  onDeleted: (categoryId: string) => void;
};

export function useCategoryForm({ visible, orgId, editing, onSaved, onDeleted }: Args) {
  const isNew = editing === null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName(editing?.name ?? '');
      setDescription(editing?.description ?? '');
      setError(null);
    }
  }, [visible, editing]);

  async function handleSave() {
    if (!name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const result = await contentService.createCategory(orgId, name.trim(), description.trim() || undefined);
        onSaved(true, result);
      } else {
        await contentService.updateCategory(orgId, {
          categoryId: editing!.categoryId,
          name: name.trim(),
          description: description.trim() || undefined,
        });
        onSaved(false, { ...editing!, name: name.trim(), description: description.trim() || null });
      }
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editing) return;
    const ok = await confirm({
      title: 'Delete category',
      message: `Delete the "${editing.name}" category? This cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await contentService.deleteCategory(orgId, editing.categoryId);
      onDeleted(editing.categoryId);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to delete category.');
    } finally {
      setDeleting(false);
    }
  }

  return {
    isNew,
    name, setName,
    description, setDescription,
    saving, deleting, error,
    handleSave, handleDelete,
  };
}
