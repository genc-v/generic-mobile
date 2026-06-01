export enum Microservice {
  AUTH = 'auth',
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
    jwtToken: string;
    refreshToken: string;
    twoFactorId: string | null;
  };
}

export interface AuthRefreshResponse {
  success: boolean;
  data: string; // new JWT token
}
