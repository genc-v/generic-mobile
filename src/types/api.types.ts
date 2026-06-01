export enum Microservice {
  AUTH = 'auth',
  PROFILE = 'profile',
  ENTRY = 'entry',
  ORGANISATION = 'organisation',
  ASSET = 'asset',
}

export enum RequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface ApiRequestOptions {
  microservice: Microservice;
  path?: string; // To handle sub-routes like '/login'
  type: RequestType;
  body?: any;
  needs2fa?: boolean;
}

// -----------------------------------------------------------------------------
// Auth DTOs
// -----------------------------------------------------------------------------

export interface AuthLoginResponse {
  success: boolean;
  data?: {
    jwtToken: string | null;
    refreshToken: string | null;
    twoFactorId: string | null;
  };
}

export interface Auth2faLoginResponse {
  success: boolean;
  data?: {
    jwtToken: string;
    refreshToken: string;
  };
}

export interface Auth2faSetupResponse {
  success: boolean;
  data?: {
    account: string;
    manualEntryKey: string;
    qrCodeSetupImageUrl: string;
  };
}

export interface Auth2faActionResponse {
  success: boolean;
  data: null;
}

export interface AuthRefreshResponse {
  success: boolean;
  data: string; // new JWT token
}

export interface AuthRegisterResponse {
  success: boolean;
  data?: {
    jwtToken: string;
    refreshToken: string;
  };
}

export interface AccountResponse {
  success: boolean;
  data?: {
    username: string;
    email: string;
    hasTwoFactorAuth: boolean;
    roles: string[];
  };
}

export interface UpdateAccountBody {
  email: string;
  username: string;
  currentPassword: string;
  newPassword: string;
}

export interface UpdateAccountResponse {
  success: boolean;
  data: null;
}
