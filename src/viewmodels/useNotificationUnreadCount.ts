import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchNotifications } from '../services/notification.service';
import { NotificationItem } from '../types/notification.types';

export function countUnreadNotifications(items: NotificationItem[]): number {
  return items.filter(n => !n.isRead).length;
}

/** Badge count for screens that only need unread total (e.g. org header). */
export function useNotificationUnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const items = await fetchNotifications();
      setUnreadCount(countUnreadNotifications(items));
    } catch {
      // Keep the last count if the request fails.
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { unreadCount, refresh };
}
