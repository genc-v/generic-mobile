import { useState, useEffect, useCallback, useRef } from 'react';
import { contentService } from '../services/content.service';
import { CategoryResponseDTO, CategoryDetail } from '../types/content.types';

export function useCategoryList(orgId: string) {
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CategoryDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCategories = useCallback(async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contentService.listCategories(orgId, q);
      setCategories(data);
    } catch {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  function handleSearchChange(text: string) {
    setSearch(text);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => fetchCategories(text), 350);
  }

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }

  async function openEdit(cat: CategoryResponseDTO) {
    setLoadingDetail(true);
    setShowForm(true);
    try {
      const detail = await contentService.getCategory(orgId, cat.categoryId);
      setEditing(detail);
    } catch {
      setEditing({ categoryId: cat.categoryId, name: cat.name ?? '', description: null, organisationId: orgId, userId: '' });
    } finally {
      setLoadingDetail(false);
    }
  }

  function handleSaved(isNew: boolean, result: CategoryDetail) {
    setShowForm(false);
    setEditing(null);
    if (isNew) {
      setCategories(prev => [...prev, { categoryId: result.categoryId, name: result.name }]);
    } else {
      setCategories(prev => prev.map(c => c.categoryId === result.categoryId ? { ...c, name: result.name } : c));
    }
  }

  function handleDeleted(categoryId: string) {
    setCategories(prev => prev.filter(c => c.categoryId !== categoryId));
    setShowForm(false);
    setEditing(null);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  return {
    categories, loading, error, search,
    showForm, editing, loadingDetail,
    fetchCategories,
    handleSearchChange,
    openNew, openEdit,
    handleSaved, handleDeleted, closeForm,
  };
}
