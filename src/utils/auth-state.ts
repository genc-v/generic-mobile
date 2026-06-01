// A simple module state for auth variables that are purely session/memory based.
// Tokens (JWT and RT) are now strictly stored securely via expo-secure-store.

class AuthState {
  private _is2faVerified = false;

  get is2faVerified() {
    return this._is2faVerified;
  }

  set2faVerified(status: boolean) {
    this._is2faVerified = status;
  }
}

// Export a singleton instance to be used across the app
export const authState = new AuthState();