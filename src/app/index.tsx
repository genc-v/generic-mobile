import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import { authService, SECURE_STORE_KEYS } from "../services/auth.service";
import { DS } from "../constants/ds";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        await authService.setup();
        const jwt = await SecureStore.getItemAsync(SECURE_STORE_KEYS.JWT_TOKEN);
        if (jwt) {
          router.replace("/(app)");
        } else {
          router.replace("/(auth)");
        }
      } catch {
        router.replace("/(auth)");
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    init();
  }, []);

  return <View style={{ flex: 1, backgroundColor: DS.bg }} />;
}
