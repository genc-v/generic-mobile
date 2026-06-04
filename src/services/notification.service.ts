import * as signalR from '@microsoft/signalr';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import {
    NotificationItem,
    NotificationsListResponse,
} from '../types/notification.types';
import { authService, SECURE_STORE_KEYS } from './auth.service';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://user.jonfjz.dev/api';

// Hub lives on the auth service — same base as auth.service AUTH_API_URL.
const AUTH_API_BASE = process.env.EXPO_PUBLIC_API_URL
  ? `${process.env.EXPO_PUBLIC_API_URL}/auth`
  : 'https://user.jonfjz.dev/api/auth';

const NOTIFICATIONS_HUB_URL = `${AUTH_API_BASE}/hubs/notifications`;

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

  // Expo Go / React Native: WebSockets often fail on negotiate or upgrade (proxy,
  // missing sticky sessions, RN stack). Long polling uses plain HTTP like REST.
  const transport =
    Platform.OS === 'web'
      ? signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      : signalR.HttpTransportType.LongPolling;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(NOTIFICATIONS_HUB_URL, {
      transport,
      accessTokenFactory: async () => {
        await authService.checkAndRefreshJwt();
        return (await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN)) ?? '';
      },
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
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
