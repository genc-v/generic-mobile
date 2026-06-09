import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (!result.success || !result.data) {
        setError('Invalid email or password.');
        return;
      }
      if (result.data.twoFactorId !== null) {
        router.replace({ pathname: '/(auth)/two-factor', params: { twoFactorId: result.data.twoFactorId } });
      } else {
        router.replace('/(app)');
      }
    } catch (err) {
      const status = (err as { status?: number })?.status;
      setError(
        status === 400 || status === 404
          ? 'Invalid email or password.'
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  function goToRegister() {
    router.replace('/(auth)/register');
  }

  function goToForgotPassword() {
    router.push('/(auth)/forgot-password');
  }

  return {
    email, setEmail, password, setPassword, error, loading,
    handleLogin, goToRegister, goToForgotPassword,
  };
}
