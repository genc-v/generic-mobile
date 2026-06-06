import { useState, useCallback, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { contentService } from '../services/content.service';
import { toast } from '../utils/toast';
import { ContentDTO } from '../types/content.types';

export type StatusFilter = 'All' | 'New' | 'Draft' | 'Published' | 'Unpublished';

export interface AdvancedFilters {
  category: string;
  tag: string;
  fromDate: string;
  toDate: string;
}

const EMPTY_ADVANCED: AdvancedFilters = { category: '', tag: '', fromDate: '', toDate: '' };

export function useContentList(orgId: string) {
  const router = useRouter();
  const [entries, setEntries] = useState<ContentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('All');
  const [advanced, setAdvanced] = useState<AdvancedFilters>(EMPTY_ADVANCED);
  const [showFilters, setShowFilters] = useState(false);

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoaded = useRef(false);

  // `silent` refetches keep the current list on screen instead of flipping to a
  // full-screen spinner — used on focus so returning to the screen doesn't blank
  // it mid-transition.
  const fetchEntries = useCallback(async (
    query: string,
    status: StatusFilter,
    adv: AdvancedFilters,
    silent = false,
  ) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await contentService.listEntries(orgId, {
        query: query || undefined,
        status: status === 'All' ? undefined : status,
        category: adv.category || undefined,
        tag: adv.tag || undefined,
        fromDate: adv.fromDate || undefined,
        toDate: adv.toDate || undefined,
      });
      setEntries(data);
      hasLoaded.current = true;
    } catch (e: any) {
      const msg = e?.message ?? 'Failed to load entries.';
      setError(msg);
      toast.error(msg);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [orgId]);

  // Refetch on focus, but silently once the first load has happened so the
  // existing list stays visible while a back transition plays.
  useFocusEffect(
    useCallback(() => {
      fetchEntries(search, filter, advanced, hasLoaded.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchEntries]),
  );

  function handleSearchChange(text: string) {
    setSearch(text);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetchEntries(text, filter, advanced), 350);
  }

  function handleFilterChange(next: StatusFilter) {
    setFilter(next);
    fetchEntries(search, next, advanced);
  }

  function applyAdvanced(next: AdvancedFilters) {
    setAdvanced(next);
    setShowFilters(false);
    fetchEntries(search, filter, next);
  }

  function clearAdvanced() {
    setAdvanced(EMPTY_ADVANCED);
    setShowFilters(false);
    fetchEntries(search, filter, EMPTY_ADVANCED);
  }

  const advancedCount =
    (advanced.category ? 1 : 0) +
    (advanced.tag ? 1 : 0) +
    (advanced.fromDate ? 1 : 0) +
    (advanced.toDate ? 1 : 0);

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
    entries,
    totalCount: entries.length,
    loading,
    creating,
    error,
    search,
    setSearch: handleSearchChange,
    filter,
    setFilter: handleFilterChange,
    advanced,
    advancedCount,
    showFilters,
    setShowFilters,
    applyAdvanced,
    clearAdvanced,
    refetch: () => fetchEntries(search, filter, advanced),
    handleNewEntry,
    handleOpenEntry,
  };
}
