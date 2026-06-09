import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { authService, SECURE_STORE_KEYS } from './auth.service';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://user.jonfjz.dev/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function getProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as unknown as { easConfig?: { projectId?: string } }).easConfig?.projectId
  );
}

export async function registerForPushNotifications(): Promise<void> {
  try {
    if (!Device.isDevice && Platform.OS === 'ios') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        lightColor: '#FFFFFF',
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (existing !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return;

    const projectId = getProjectId();
    if (!projectId) return;

    const { data: expoToken } = await Notifications.getExpoPushTokenAsync({ projectId });
    await sendTokenToBackend(expoToken);
  } catch (error) {
    console.warn('Push registration failed:', error);
  }
}

async function sendTokenToBackend(token: string): Promise<void> {
  await authService.checkAndRefreshJwt();
  const jwt = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  if (!jwt) return;

  await fetch(`${BASE_URL}/notifications/device-token`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ token, platform: Platform.OS }),
  });
}
