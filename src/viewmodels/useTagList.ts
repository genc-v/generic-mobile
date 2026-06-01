import { useState, useEffect, useCallback, useRef } from 'react';
import { contentService } from '../services/content.service';
import { TagDTO } from '../types/content.types';

export function useTagList(orgId: string) {
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTags = useCallback(async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contentService.listTags(orgId, q);
      setTags(data);
    } catch {
      setError('Failed to load tags.');
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { fetchTags(); }, [fetchTags]);

  function handleSearchChange(text: string) {
    setSearch(text);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetchTags(text), 350);
  }

  function openNew() {
    setEditingTag(null);
    setShowForm(true);
  }

  function openEdit(tag: TagDTO) {
    setEditingTag(tag);
    setShowForm(true);
  }

  function handleSaved(isNew: boolean, tagId: string, name: string) {
    setShowForm(false);
    setEditingTag(null);
    if (isNew) {
      setTags(prev => [...prev, { tagId, name }]);
    } else {
      setTags(prev => prev.map(t => t.tagId === tagId ? { ...t, name } : t));
    }
  }

  function handleDeleted(tagId: string) {
    setTags(prev => prev.filter(t => t.tagId !== tagId));
    setShowForm(false);
    setEditingTag(null);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTag(null);
  }

  return {
    tags, loading, error, search,
    showForm, editingTag,
    fetchTags, handleSearchChange,
    openNew, openEdit,
    handleSaved, handleDeleted, closeForm,
  };
}
