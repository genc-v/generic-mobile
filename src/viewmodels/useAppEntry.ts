import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { authService, SECURE_STORE_KEYS } from '../services/auth.service';

SplashScreen.preventAutoHideAsync();

// Bootstraps the session on launch and routes into the app or the auth flow.
export function useAppEntry() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        await authService.setup();
        const jwt = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
        router.replace(jwt ? '/(app)' : '/(auth)/login');
      } catch {
        router.replace('/(auth)/login');
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    init();
  }, []);
}
