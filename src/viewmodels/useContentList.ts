import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { contentService } from '../services/content.service';
import { ContentDTO } from '../types/content.types';

export type StatusFilter = 'All' | 'New' | 'Draft' | 'Published' | 'Unpublished';

export function useContentList(orgId: string) {
  const router = useRouter();
  const [entries, setEntries] = useState<ContentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('All');

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contentService.listEntries(orgId);
      setEntries(data);
    } catch {
      setError('Failed to load entries.');
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filtered = entries.filter(e => {
    const matchesFilter = filter === 'All' || (e.status ?? 'New') === filter;
    const matchesSearch = !search || (e.title ?? '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  async function handleNewEntry() {
    setCreating(true);
    try {
      const newId = await contentService.getNewId(orgId);
      router.push(`/(app)/${orgId}/entry/${newId}`);
    } catch {
      setError('Failed to create entry.');
    } finally {
      setCreating(false);
    }
  }

  function handleOpenEntry(entryId: string) {
    router.push(`/(app)/${orgId}/entry/${entryId}`);
  }

  return {
    entries: filtered,
    totalCount: entries.length,
    loading,
    creating,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    fetchEntries,
    handleNewEntry,
    handleOpenEntry,
  };
}
