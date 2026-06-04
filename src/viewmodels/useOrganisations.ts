import { useState, useRef, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { organisationService } from '../services/organisation.service';
import { useNotificationUnreadCount } from './useNotificationUnreadCount';
import { Organisation } from '../types/organisation.types';

const PAGE_SIZE = 10;

export function useOrganisations() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { unreadCount } = useNotificationUnreadCount();

  const currentPage = useRef(1);
  const hasMore = useRef(true);
  const hasLoaded = useRef(false);

  const fetchPage = useCallback(async (page: number, replace: boolean) => {
    try {
      const result = await organisationService.list(page, PAGE_SIZE);
      setTotalCount(result.totalCount);
      hasMore.current = result.pageNumber < result.totalPages;
      currentPage.current = result.pageNumber;
      setOrgs(prev => replace ? result.items : [...prev, ...result.items]);
      hasLoaded.current = true;
    } catch {
      setError('Failed to load organisations.');
    }
  }, []);

  // Refetch on focus so renames/new orgs from other screens show up. First load
  // shows the skeleton; later focuses refetch silently to keep the list visible.
  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded.current) {
        setLoading(true);
        setError(null);
        fetchPage(1, true).finally(() => setLoading(false));
      } else {
        fetchPage(1, true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchPage]),
  );

  const handleRefresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    await fetchPage(1, true);
    setLoading(false);
  }, [fetchPage]);

  const handleEndReached = useCallback(async () => {
    if (loadingMore || !hasMore.current) return;
    setLoadingMore(true);
    await fetchPage(currentPage.current + 1, false);
    setLoadingMore(false);
  }, [loadingMore, fetchPage]);

  function handleOrgCreated(org: Organisation) {
    setShowCreate(false);
    setOrgs(prev => [org, ...prev]);
    setTotalCount(c => c + 1);
  }

  function goToProfile() {
    router.push('/(app)/profile');
  }

  function goToNotifications() {
    router.push('/(app)/profile/notifications');
  }

  function goToOrg(orgId: string) {
    router.push(`/(app)/${orgId}`);
  }

  return {
    orgs, totalCount, loading, loadingMore, error,
    showCreate, setShowCreate, hasMore,
    unreadCount,
    handleRefresh, handleEndReached, handleOrgCreated, goToProfile, goToNotifications, goToOrg,
  };
}
