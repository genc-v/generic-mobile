import { executeApiRequest } from './api.service';
import { Microservice, RequestType } from '../types/api.types';
import {
  ManagedUser,
  PaginatedUsers,
  Role,
  UserRole,
  UserSearchParams,
} from '../types/user-management.types';

export const userManagementService = {
  async listUsers(pageNumber = 1, pageSize = 20): Promise<PaginatedUsers> {
    return executeApiRequest<PaginatedUsers>({
      microservice: Microservice.USER,
      path: `?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      type: RequestType.GET,
    });
  },

  async searchUsers(params: UserSearchParams): Promise<PaginatedUsers> {
    const q = new URLSearchParams();
    if (params.username) q.set('username', params.username);
    if (params.email) q.set('email', params.email);
    if (params.isAdmin != null) q.set('isAdmin', String(params.isAdmin));
    if (params.orderBy) q.set('orderBy', params.orderBy);
    if (params.descending != null) q.set('descending', String(params.descending));
    q.set('pageNumber', String(params.pageNumber ?? 1));
    q.set('pageSize', String(params.pageSize ?? 20));
    return executeApiRequest<PaginatedUsers>({
      microservice: Microservice.USER,
      path: `/search?${q.toString()}`,
      type: RequestType.GET,
    });
  },

  async getUser(id: string): Promise<ManagedUser> {
    return executeApiRequest<ManagedUser>({
      microservice: Microservice.USER,
      path: `/${id}`,
      type: RequestType.GET,
    });
  },

  async updateUser(id: string, body: { username: string; email: string }): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.USER,
      path: `/${id}`,
      type: RequestType.PUT,
      body,
    });
  },

  async deleteUser(id: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.USER,
      path: `/${id}`,
      type: RequestType.DELETE,
    });
  },

  async deleteUsersBulk(ids: string[]): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.USER,
      path: '/delete-bulk',
      type: RequestType.POST,
      body: ids,
    });
  },

  async listRoles(): Promise<Role[]> {
    const result = await executeApiRequest<Role[]>({
      microservice: Microservice.ROLES,
      type: RequestType.GET,
    });
    return Array.isArray(result) ? result : [];
  },

  async createRole(body: { name: string; description?: string | null }): Promise<Role> {
    return executeApiRequest<Role>({
      microservice: Microservice.ROLES,
      type: RequestType.POST,
      body,
    });
  },

  async updateRole(id: string, body: { name?: string; description?: string | null }): Promise<Role> {
    return executeApiRequest<Role>({
      microservice: Microservice.ROLES,
      path: `/${id}`,
      type: RequestType.PUT,
      body,
    });
  },

  async deleteRole(id: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.ROLES,
      path: `/${id}`,
      type: RequestType.DELETE,
    });
  },

  async getUserRoles(userId: string): Promise<UserRole[]> {
    const result = await executeApiRequest<UserRole[]>({
      microservice: Microservice.ROLES,
      path: `/user/${userId}`,
      type: RequestType.GET,
    });
    return Array.isArray(result) ? result : [];
  },

  async assignRole(userId: string, roleId: string): Promise<UserRole> {
    return executeApiRequest<UserRole>({
      microservice: Microservice.ROLES,
      path: `/user/${userId}`,
      type: RequestType.POST,
      body: { roleId },
    });
  },

  async removeRole(userId: string, roleId: string): Promise<void> {
    await executeApiRequest({
      microservice: Microservice.ROLES,
      path: `/user/${userId}/${roleId}`,
      type: RequestType.DELETE,
    });
  },
};
