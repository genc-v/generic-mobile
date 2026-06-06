import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { DS } from '../../constants/ds';
import { notificationHub } from '../../utils/notification-hub';
import { toast } from '../../utils/toast';

export default function AppLayout() {
  useEffect(() => {
    notificationHub.start();

    const unsub = notificationHub.subscribe(() => {
      toast.info('You have a new notification.');
    });

    return () => {
      unsub();
      notificationHub.stop();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: DS.bg },
        animation: 'default',
        gestureEnabled: true,
        freezeOnBlur: false,
      }}
    />
  );
}
