import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notification.service';
import { NotificationItem } from '../types/notification.types';
import { notificationHub } from '../utils/notification-hub';
import { toast } from '../utils/toast';
import { countUnreadNotifications } from './useNotificationUnreadCount';

function mergeNotification(
  list: NotificationItem[],
  incoming: NotificationItem,
): NotificationItem[] {
  const without = list.filter(n => n.id !== incoming.id);
  return [{ ...incoming, isRead: false }, ...without];
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hubConnected, setHubConnected] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(1);

  const unreadCount = useMemo(
    () => countUnreadNotifications(notifications),
    [notifications],
  );
  const hasItems = notifications.length > 0;
  const canMarkAllRead = hasItems && unreadCount > 0;
  const canClearAll = hasItems;

  const inboxSummary = useMemo(() => {
    if (!hasItems) return '';
    return unreadCount > 0 ? `${unreadCount} unread` : 'All caught up';
  }, [hasItems, unreadCount]);

  const emptyHint = hubConnected
    ? 'When something happens in your account, updates will show up here in real time.'
    : 'Nothing in your inbox yet. Live updates need the API running on port 5053.';

  const statusLabel = hubConnected
    ? '● Live connection'
    : '○ Offline — REST only';

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    pageRef.current = 1;
    try {
      const result = await fetchNotifications(1);
      setNotifications(result.items);
      setHasMore(result.hasMore);
      pageRef.current = 1;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load notifications.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const result = await fetchNotifications(nextPage);
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const fresh = result.items.filter(n => !existingIds.has(n.id));
        return [...prev, ...fresh];
      });
      setHasMore(result.hasMore);
      pageRef.current = nextPage;
    } catch {
      // Non-critical — user can scroll again to retry.
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    load();

    setHubConnected(notificationHub.isRunning);

    const unsub = notificationHub.subscribe(notification => {
      setNotifications(prev => mergeNotification(prev, notification));
      setHubConnected(true);
    });

    return () => {
      unsub();
    };
  }, [load]);

  async function markRead(id: string) {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n),
    );
    try {
      await markNotificationRead(id);
    } catch {
      // Optimistic update stays — non-critical if the server call fails.
    }
  }

  async function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // Optimistic update stays — non-critical if the server call fails.
    }
  }

  function clearAll() {
    setNotifications([]);
  }

  return {
    notifications,
    loading,
    loadingMore,
    error,
    hubConnected,
    unreadCount,
    hasItems,
    hasMore,
    canMarkAllRead,
    canClearAll,
    inboxSummary,
    emptyHint,
    statusLabel,
    markRead,
    markAllRead,
    clearAll,
    reload: load,
    loadMore,
  };
}
