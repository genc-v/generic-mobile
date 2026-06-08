import * as SecureStore from 'expo-secure-store';
import { authService, SECURE_STORE_KEYS } from './auth.service';
import { AccountResponse, UpdateAccountBody, UpdateAccountResponse } from '../types/api.types';

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

export const accountService = {
  async get(): Promise<AccountResponse> {
    const response = await fetch(`${AUTH_API_URL}/account`, {
      method: 'GET',
      headers: await authedHeaders(),
    });
    if (!response.ok) throw new Error(`Get account failed with status ${response.status}`);
    return response.json();
  },

  async update(body: Partial<UpdateAccountBody>): Promise<UpdateAccountResponse> {
    const response = await fetch(`${AUTH_API_URL}/account`, {
      method: 'PUT',
      headers: await authedHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Update account failed with status ${response.status}`);
    return response.json();
  },
};
