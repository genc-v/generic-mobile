import { useCallback, useEffect, useState } from 'react';
import { NotificationItem } from '../types/notification.types';
import {
  fetchNotifications,
  startNotificationHub,
  stopNotificationHub,
} from '../services/notification.service';

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
    markAllRead,
    clearAll,
    reload: load,
  };
}
