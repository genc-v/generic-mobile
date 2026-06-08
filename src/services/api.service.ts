import * as SecureStore from 'expo-secure-store';
import { ApiRequestOptions, Microservice, RequestType } from '../types/api.types';
import { authState } from '../utils/auth-state';
import { authService, SECURE_STORE_KEYS } from './auth.service';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://user.jonfjz.dev/api';

function httpErrorMessage(status: number, body: string): string {
  try {
    const json = JSON.parse(body);
    const msg = json?.message || json?.title || json?.detail || json?.error;
    if (typeof msg === 'string' && msg.length > 0 && msg.length < 200) return msg;
  } catch {
    if (body && body.length < 120 && !body.startsWith('<') && !body.startsWith('{')) return body;
  }
  switch (status) {
    case 400: return 'Invalid request. Please check the data.';
    case 401: return 'Your session has expired. Please log in again.';
    case 403: return "You don't have permission to do that.";
    case 404: return 'The requested item was not found.';
    case 409: return 'A conflict occurred — the item may have changed.';
    case 422: return 'The server could not process the request.';
    case 429: return 'Too many requests. Please wait a moment.';
    case 500: return 'Server error. Please try again.';
    case 503: return 'Service unavailable. Please try again later.';
    default: return `Request failed (${status}).`;
  }
}

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
    const body = await response.text().catch(() => '');
    throw new Error(httpErrorMessage(response.status, body));
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