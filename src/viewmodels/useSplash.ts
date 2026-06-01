import { useRouter } from 'expo-router';

export function useSplash() {
  const router = useRouter();

  function goToLogin() {
    router.push('/(auth)/login');
  }

  function goToRegister() {
    router.push('/(auth)/register');
  }

  return { goToLogin, goToRegister };
}
