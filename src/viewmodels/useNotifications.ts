import { useCallback, useEffect, useMemo, useState } from 'react';
import { NotificationItem } from '../types/notification.types';
import {
  fetchNotifications,
  startNotificationHub,
  stopNotificationHub,
} from '../services/notification.service';
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
  const [error, setError] = useState<string | null>(null);
  const [hubConnected, setHubConnected] = useState(false);

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
    try {
      const items = await fetchNotifications();
      setNotifications(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    let active = true;

    startNotificationHub(notification => {
      if (!active) return;
      setNotifications(prev => mergeNotification(prev, notification));
    })
      .then(() => {
        if (active) setHubConnected(true);
      })
      .catch(() => {
        if (active) setHubConnected(false);
      });

    return () => {
      active = false;
      stopNotificationHub();
    };
  }, [load]);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  return {
    notifications,
    loading,
    error,
    hubConnected,
    unreadCount,
    hasItems,
    canMarkAllRead,
    canClearAll,
    inboxSummary,
    emptyHint,
    statusLabel,
    markAllRead,
    clearAll,
    reload: load,
  };
}
