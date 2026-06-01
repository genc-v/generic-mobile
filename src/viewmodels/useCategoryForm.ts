import { useState, useEffect } from 'react';
import { contentService } from '../services/content.service';
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
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editing) return;
    setDeleting(true);
    try {
      await contentService.deleteCategory(orgId, editing.categoryId);
      onDeleted(editing.categoryId);
    } catch {
      setError('Failed to delete. Please try again.');
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
