import * as signalR from '@microsoft/signalr';
import * as SecureStore from 'expo-secure-store';
import {
    NotificationItem,
    NotificationsListResponse,
} from '../types/notification.types';
import { authService, SECURE_STORE_KEYS } from './auth.service';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://user.jonfjz.dev/api';

function normalizeNotification(raw: NotificationItem): NotificationItem {
  return {
    ...raw,
    id: raw.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    isRead: raw.isRead ?? raw.read ?? false,
    createdAt: raw.createdAt ?? raw.created ?? new Date().toISOString(),
  };
}

function parseListResponse(json: NotificationsListResponse | NotificationItem[]): NotificationItem[] {
  if (Array.isArray(json)) {
    return json.map(normalizeNotification);
  }
  const items = json.data ?? [];
  return items.map(normalizeNotification);
}

async function authHeaders(): Promise<Record<string, string>> {
  await authService.checkAndRefreshJwt();
  const jwt = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  return {
    accept: 'application/json',
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const response = await fetch(`${BASE_URL}/notifications`, {
    headers: await authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`GET notifications failed with status ${response.status}`);
  }

  const json = await response.json();
  return parseListResponse(json);
}

let connection: signalR.HubConnection | null = null;

export async function startNotificationHub(
  onReceive: (notification: NotificationItem) => void,
): Promise<void> {
  const jwt = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  if (!jwt) return;

  await stopNotificationHub();

  const hubUrl = `${BASE_URL}/auth/hubs/notifications?access_token=${encodeURIComponent(jwt)}`;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      // Expo Go / React Native: prefer WebSockets, fall back to long-polling.
      transport:
        signalR.HttpTransportType.WebSockets |
        signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .build();

  connection.on('ReceiveNotification', (payload: NotificationItem) => {
    onReceive(normalizeNotification(payload));
  });

  await connection.start();
}

export async function stopNotificationHub(): Promise<void> {
  if (!connection) return;
  try {
    await connection.stop();
  } catch {
    // Hub may already be disconnected.
  }
  connection = null;
}
