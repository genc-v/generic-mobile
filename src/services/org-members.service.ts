import * as SecureStore from 'expo-secure-store';
import { executeApiRequest } from './api.service';
import { authService, SECURE_STORE_KEYS } from './auth.service';
import { Microservice, RequestType } from '../types/api.types';
import {
  OrgMember,
  OrgMembersPage,
  UserPublicProfile,
} from '../types/org-members.types';

const USER_API = process.env.EXPO_PUBLIC_API_URL ?? 'https://user.jonfjz.dev/api';

async function userPublicRequest<T>(
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body?: unknown,
): Promise<T> {
  await authService.checkAndRefreshJwt();
  const jwt = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
  const headers: Record<string, string> = {
    accept: 'text/plain',
    'Content-Type': 'application/json',
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };
  const response = await fetch(`${USER_API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`User public request failed: ${response.status}`);
  }
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const orgMembersService = {
  async listMembers(
    orgId: string,
    page = 1,
    pageSize = 20,
  ): Promise<OrgMembersPage> {
    return executeApiRequest<OrgMembersPage>({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/members?page=${page}&pageSize=${pageSize}`,
      type: RequestType.GET,
    });
  },

  async addMember(
    orgId: string,
    userId: string,
    roleTemplate: string,
  ): Promise<OrgMember> {
    return executeApiRequest<OrgMember>({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/members`,
      type: RequestType.POST,
      body: { userId, roleTemplate },
    });
  },

  async removeMember(orgId: string, userId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/members/${userId}`,
      type: RequestType.DELETE,
    });
  },

  async updateRole(orgId: string, userId: string, role: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.ORGANISATION,
      path: `/organisations/${orgId}/members/${userId}/role`,
      type: RequestType.PUT,
      body: role,
    });
  },

  async lookupByEmail(email: string): Promise<UserPublicProfile> {
    return userPublicRequest<UserPublicProfile>(
      `/public/user/by-email?email=${encodeURIComponent(email)}`,
    );
  },

  async getProfiles(userIds: string[]): Promise<UserPublicProfile[]> {
    if (userIds.length === 0) return [];
    const result = await userPublicRequest<UserPublicProfile[]>(
      '/public/users/profiles',
      'POST',
      userIds,
    );
    return Array.isArray(result) ? result : [];
  },
};
