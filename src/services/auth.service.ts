import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { authState } from "../utils/auth-state";
import {
  AuthLoginResponse,
  AuthRefreshResponse,
  AuthRegisterResponse,
  Auth2faLoginResponse,
  Auth2faSetupResponse,
  Auth2faActionResponse,
  AccountResponse,
  UpdateAccountBody,
  UpdateAccountResponse,
} from "../types/api.types";

export const SECURE_STORE_KEYS = {
  REFRESH_TOKEN: "generic_cms_refresh_token",
  JWT_TOKEN: "generic_cms_jwt_token",
};

const AUTH_API_URL = process.env.EXPO_PUBLIC_API_URL
  ? `${process.env.EXPO_PUBLIC_API_URL}/auth`
  : "https://user.jonfjz.dev/api/auth";

const AUTH_HEADERS = {
  accept: "application/json",
  "Content-Type": "application/json",
};

class AuthService {
  async setup() {
    try {
      const [refreshToken, jwtToken] = await Promise.all([
        SecureStore.getItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN),
      ]);

      if (!refreshToken || !jwtToken) return;

      await this.checkAndRefreshJwt();

      console.log(jwtToken);
      const currentJwt = await SecureStore.getItemAsync(
        SECURE_STORE_KEYS.JWT_TOKEN,
      );
      if (currentJwt) {
        authState.set2faVerified(true);
      }
    } catch (error) {
      console.error("Failed to setup auth session:", error);
      await this.logout();
    }
  }

  async login(email: string, password: string): Promise<AuthLoginResponse> {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: AUTH_HEADERS,
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    const result: AuthLoginResponse = await response.json();

    if (result.success && result.data) {
      const { jwtToken, refreshToken, twoFactorId } = result.data;

      await Promise.all([
        refreshToken
          ? SecureStore.setItemAsync(
              SECURE_STORE_KEYS.REFRESH_TOKEN,
              refreshToken,
            )
          : Promise.resolve(),
        jwtToken
          ? SecureStore.setItemAsync(SECURE_STORE_KEYS.JWT_TOKEN, jwtToken)
          : Promise.resolve(),
      ]);

      authState.set2faVerified(twoFactorId === null);
    }

    return result;
  }

  async verify2fa(
    loginId: string,
    code: string,
  ): Promise<Auth2faLoginResponse> {
    const response = await fetch(`${AUTH_API_URL}/2fa/login`, {
      method: "POST",
      headers: AUTH_HEADERS,
      body: JSON.stringify({ loginId, code }),
    });

    if (!response.ok) {
      throw new Error(`2FA verification failed with status ${response.status}`);
    }

    const result: Auth2faLoginResponse = await response.json();

    if (result.success && result.data) {
      const { jwtToken, refreshToken } = result.data;
      await Promise.all([
        SecureStore.setItemAsync(SECURE_STORE_KEYS.JWT_TOKEN, jwtToken),
        SecureStore.setItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);
      authState.set2faVerified(true);
    }

    return result;
  }

  async register(
    email: string,
    username: string,
    password: string,
  ): Promise<AuthRegisterResponse> {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: AUTH_HEADERS,
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed with status ${response.status}`);
    }

    const result: AuthRegisterResponse = await response.json();

    if (result.success && result.data) {
      const { jwtToken, refreshToken } = result.data;
      await Promise.all([
        refreshToken
          ? SecureStore.setItemAsync(
              SECURE_STORE_KEYS.REFRESH_TOKEN,
              refreshToken,
            )
          : Promise.resolve(),
        jwtToken
          ? SecureStore.setItemAsync(SECURE_STORE_KEYS.JWT_TOKEN, jwtToken)
          : Promise.resolve(),
      ]);
      authState.set2faVerified(true);
    }

    return result;
  }

  async refreshSession(refreshToken: string): Promise<void> {
    const jwtToken = await SecureStore.getItemAsync(
      SECURE_STORE_KEYS.JWT_TOKEN,
    );

    const response = await fetch(`${AUTH_API_URL}/refresh`, {
      method: "POST",
      headers: {
        ...AUTH_HEADERS,
        ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Refresh failed with status ${response.status}`);
    }

    const result: AuthRefreshResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Refresh token invalid");
    }

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.JWT_TOKEN, result.data);
    authState.set2faVerified(true);
  }

  async checkAndRefreshJwt(bufferInSeconds = 300): Promise<void> {
    const jwtToken = await SecureStore.getItemAsync(
      SECURE_STORE_KEYS.JWT_TOKEN,
    );
    if (!jwtToken) return;

    try {
      const decoded = jwtDecode<{ exp?: number }>(jwtToken);
      if (!decoded.exp) return;

      const timeToExpiry = decoded.exp - Math.floor(Date.now() / 1000);
      if (timeToExpiry > bufferInSeconds) return;

      const refreshToken = await SecureStore.getItemAsync(
        SECURE_STORE_KEYS.REFRESH_TOKEN,
      );
      if (refreshToken) {
        await this.refreshSession(refreshToken);
      } else {
        await this.logout();
      }
    } catch (error) {
      console.error("Error checking JWT expiration:", error);
    }
  }

  private async authedHeaders(): Promise<Record<string, string>> {
    const jwtToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
    return {
      ...AUTH_HEADERS,
      ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
    };
  }

  async getAccount(): Promise<AccountResponse> {
    const response = await fetch(`${AUTH_API_URL}/account`, {
      method: 'GET',
      headers: await this.authedHeaders(),
    });
    if (!response.ok) throw new Error(`Get account failed with status ${response.status}`);
    return response.json();
  }

  async updateAccount(body: Partial<UpdateAccountBody>): Promise<UpdateAccountResponse> {
    const response = await fetch(`${AUTH_API_URL}/account`, {
      method: 'PUT',
      headers: await this.authedHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Update account failed with status ${response.status}`);
    return response.json();
  }

  async setup2fa(): Promise<Auth2faSetupResponse> {
    const response = await fetch(`${AUTH_API_URL}/2fa/setup`, {
      method: 'POST',
      headers: await this.authedHeaders(),
    });
    if (!response.ok) throw new Error(`2FA setup failed with status ${response.status}`);
    return response.json();
  }

  async confirm2fa(code: string): Promise<Auth2faActionResponse> {
    const response = await fetch(`${AUTH_API_URL}/2fa/confirm`, {
      method: 'POST',
      headers: await this.authedHeaders(),
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error(`2FA confirm failed with status ${response.status}`);
    return response.json();
  }

  async disable2fa(code: string): Promise<Auth2faActionResponse> {
    const response = await fetch(`${AUTH_API_URL}/2fa/disable`, {
      method: 'POST',
      headers: await this.authedHeaders(),
      body: JSON.stringify({ code }),
    });
    if (!response.ok) throw new Error(`2FA disable failed with status ${response.status}`);
    return response.json();
  }

  async logout(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(SECURE_STORE_KEYS.JWT_TOKEN),
      ]);
    } catch (error) {
      console.error("Error clearing secure storage:", error);
    } finally {
      authState.set2faVerified(false);
    }
  }
}

export const authService = new AuthService();
