import * as SecureStore from 'expo-secure-store';
import { Microservice, RequestType, ApiRequestOptions } from '../types/api.types';
import { authState } from '../utils/auth-state';
import { authService, SECURE_STORE_KEYS } from './auth.service';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://user.jonfjz.dev/api';

// Microservices that live on separate domains use this map.
// When a microservice has an override, `path` is the full resource path
// (e.g. '/organisations') rather than being appended after the microservice name.
const MICROSERVICE_BASE_URLS: Partial<Record<Microservice, string>> = {
  [Microservice.ORGANISATION]: process.env.EXPO_PUBLIC_ORG_API_URL ?? 'https://organisations.jonfjz.dev',
};

/**
 * Core network client. Handles URL construction, headers, and the actual fetch request.
 * Pure Javascript/TypeScript, decoupled from React.
 */
export async function executeApiRequest<T = any>({
  microservice,
  path = '', // Defaults to empty string
  type,
  body,
  needs2fa = true, // Defaulting to true as requested
}: ApiRequestOptions): Promise<T> {
  
  // 2FA Verification check
  if (needs2fa && !authState.is2faVerified) {
    throw new Error('2FA verification is required to proceed.');
  }

  // Ensure JWT is fresh before making the request (except for auth routes to prevent loops)
  if (microservice !== Microservice.AUTH) {
    await authService.checkAndRefreshJwt();
  }

  // Construct URL — services with their own domain use path as the full resource path
  const overrideBase = MICROSERVICE_BASE_URLS[microservice];
  const url = overrideBase ? `${overrideBase}${path}` : `${BASE_URL}/${microservice}${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'accept': 'application/json', // Or 'text/plain' based on your API needs
  };

  // Fetch JWT token directly from secure storage (not memory)
  const jwtToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  
  // Attach JWT token if available
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
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}