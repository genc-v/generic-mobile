import { useState, useRef, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { organisationService } from '../services/organisation.service';
import { profileService } from '../services/profile.service';
import { toast } from '../utils/toast';
import { useNotificationUnreadCount } from './useNotificationUnreadCount';
import { Organisation } from '../types/organisation.types';
import { Profile } from '../types/profile.types';
import { cache, CACHE_KEYS } from '../utils/cache';

const PAGE_SIZE = 10;

function profileInitials(p: Profile | null | undefined): string {
  if (!p) return 'ME';
  const first = p.firstName?.[0] ?? '';
  const last = p.lastName?.[0] ?? '';
  if (first || last) return `${first}${last}`.toUpperCase();
  return (p.displayName?.[0] ?? 'ME').toUpperCase();
}

export function useOrganisations() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { unreadCount } = useNotificationUnreadCount();
  const cachedProfile = cache.getSync<Profile>(CACHE_KEYS.profile);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(cachedProfile?.avatarUrl ?? null);
  const [initials, setInitials] = useState<string>(profileInitials(cachedProfile));

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
    } catch (e: any) {
      const msg = e?.message ?? 'Failed to load organisations.';
      setError(msg);
      toast.error(msg);
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
      profileService.get()
        .then(p => {
          setAvatarUrl(p.avatarUrl ?? null);
          setInitials(profileInitials(p));
          cache.set(CACHE_KEYS.profile, p);
        })
        .catch(() => {});
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
    unreadCount, avatarUrl, initials,
    handleRefresh, handleEndReached, handleOrgCreated, goToProfile, goToNotifications, goToOrg,
  };
}
