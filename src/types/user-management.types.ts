// Types for the admin-only user & role management area, backed by the
// `/api/user` and `/api/roles` endpoints of the user service.

export interface ManagedUser {
  id: string;
  email: string;
  username: string;
  isTwoFactorEnabled: boolean;
}

export interface PaginatedUsers {
  items: ManagedUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
  roleName: string;
  assignedAt: string;
}

export interface UserSearchParams {
  username?: string;
  email?: string;
  isAdmin?: boolean;
  orderBy?: string;
  descending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
