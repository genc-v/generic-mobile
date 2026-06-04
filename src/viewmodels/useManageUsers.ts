import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { userManagementService } from '../services/user-management.service';
import { confirm, notify } from '../utils/confirm';
import { ManagedUser } from '../types/user-management.types';

const PAGE_SIZE = 20;

export function useManageUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  // Multi-select for bulk deletion.
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  // Detail sheet target.
  const [activeUser, setActiveUser] = useState<ManagedUser | null>(null);

  const currentPage = useRef(1);
  const hasMore = useRef(true);
  const hasLoaded = useRef(false);
  const searchRef = useRef('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(async (page: number, replace: boolean) => {
    const query = searchRef.current.trim();
    try {
      const result = query
        ? await userManagementService.searchUsers({
            username: query,
            email: query,
            pageNumber: page,
            pageSize: PAGE_SIZE,
          })
        : await userManagementService.listUsers(page, PAGE_SIZE);
      setTotalCount(result.totalCount);
      hasMore.current = result.pageNumber < result.totalPages;
      currentPage.current = result.pageNumber;
      setUsers(prev => (replace ? result.items : [...prev, ...result.items]));
      hasLoaded.current = true;
    } catch {
      setError('Failed to load users.');
    }
  }, []);

  // First load shows the skeleton; later focuses refetch silently so edits or
  // deletions made elsewhere show up without blanking the list.
  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded.current) {
        setLoading(true);
        setError(null);
        fetchPage(1, true).finally(() => setLoading(false));
      } else {
        fetchPage(1, true);
      }
    }, [fetchPage]),
  );

  const reload = useCallback(async () => {
    setError(null);
    setLoading(true);
    await fetchPage(1, true);
    setLoading(false);
  }, [fetchPage]);

  function onSearchChange(text: string) {
    setSearch(text);
    searchRef.current = text;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { reload(); }, 350);
  }

  const handleEndReached = useCallback(async () => {
    if (loadingMore || loading || !hasMore.current) return;
    setLoadingMore(true);
    await fetchPage(currentPage.current + 1, false);
    setLoadingMore(false);
  }, [loadingMore, loading, fetchPage]);

  // ---- Selection ----
  function toggleSelectMode() {
    setSelectMode(m => !m);
    setSelected(new Set());
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function bulkDelete() {
    const count = selected.size;
    if (count === 0) return;
    const ok = await confirm({
      title: `Delete ${count} user${count === 1 ? '' : 's'}`,
      message: `Permanently delete ${count} selected user${count === 1 ? '' : 's'}? This cannot be undone.`,
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;

    setDeleting(true);
    try {
      await userManagementService.deleteUsersBulk([...selected]);
      setSelected(new Set());
      setSelectMode(false);
      await reload();
    } catch {
      await notify('Something went wrong', 'Failed to delete the selected users.');
    } finally {
      setDeleting(false);
    }
  }

  return {
    users, totalCount, loading, loadingMore, error,
    search, onSearchChange,
    hasMore, handleEndReached, refresh: reload,
    selectMode, selected, toggleSelectMode, toggleSelect, bulkDelete, deleting,
    activeUser, setActiveUser,
  };
}
