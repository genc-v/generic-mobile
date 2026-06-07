import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_KEYS } from './auth.service';
import { Auth2faSetupResponse, Auth2faActionResponse } from '../types/api.types';

const AUTH_API_URL = process.env.EXPO_PUBLIC_API_URL
  ? `${process.env.EXPO_PUBLIC_API_URL}/auth`
  : 'https://user.jonfjz.dev/api/auth';

const BASE_HEADERS = {
  accept: 'application/json',
  'Content-Type': 'application/json',
};

async function authedHeaders(): Promise<Record<string, string>> {
  const jwt = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  return { ...BASE_HEADERS, ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) };
}

export const twoFactorService = {
  async setup(): Promise<Auth2faSetupResponse> {
    const response = await fetch(`${AUTH_API_URL}/2fa/setup`, {
      method: 'POST',
      headers: await authedHeaders(),
    });
    if (!response.ok) throw new Error(`2FA setup failed with status ${response.status}`);
    return response.json();
  },

  async confirm(code: string): Promise<Auth2faActionResponse> {
    const response = await fetch(`${AUTH_API_URL}/2fa/confirm`, {
      method: 'POST',
      headers: await authedHeaders(),
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error(`2FA confirm failed with status ${response.status}`);
    return response.json();
  },

  async disable(code: string): Promise<Auth2faActionResponse> {
    const response = await fetch(`${AUTH_API_URL}/2fa/disable`, {
      method: 'POST',
      headers: await authedHeaders(),
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error(`2FA disable failed with status ${response.status}`);
    return response.json();
  },
};
