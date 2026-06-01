import * as SecureStore from 'expo-secure-store';
import { Microservice, RequestType, ApiRequestOptions } from '../types/api.types';
import { authState } from '../utils/auth-state';
import { authService, SECURE_STORE_KEYS } from './auth.service';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://user.jonfjz.dev/api';

// Services on their own domain override the base URL; for them `path` is the
// full resource path rather than being appended after the microservice name.
const MICROSERVICE_BASE_URLS: Partial<Record<Microservice, string>> = {
  [Microservice.ORGANISATION]: process.env.EXPO_PUBLIC_ORG_API_URL ?? 'https://organisations.jonfjz.dev',
  [Microservice.CONTENT]: process.env.EXPO_PUBLIC_CONTENT_API_URL ?? 'https://content.jonfjz.dev',
};

export async function executeApiRequest<T = any>({
  microservice,
  path = '',
  type,
  body,
  needs2fa = true,
}: ApiRequestOptions): Promise<T> {
  if (needs2fa && !authState.is2faVerified) {
    throw new Error('2FA verification is required to proceed.');
  }

  // Skip the refresh for auth routes themselves to avoid a refresh loop.
  if (microservice !== Microservice.AUTH) {
    await authService.checkAndRefreshJwt();
  }

  const overrideBase = MICROSERVICE_BASE_URLS[microservice];
  const url = overrideBase ? `${overrideBase}${path}` : `${BASE_URL}/${microservice}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  };

  const jwtToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  const options: RequestInit = {
    method: type,
    headers,
  };

  if (body && type !== RequestType.GET) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Request failed with status ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
  }

  if (response.status === 204) return undefined as unknown as T;

  // These services return JSON with a text/plain content-type, so parse the
  // body directly rather than trusting the header. Empty body -> undefined.
  const text = await response.text();
  if (!text) return undefined as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}