import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';

export function useRegister() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleRegister() {
    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.register(email, username, password);
      if (!result.success) {
        setError('Registration failed. Please try again.');
        return;
      }
      router.replace('/(app)');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function goToLogin() {
    router.replace('/(auth)/login');
  }

  return {
    email, setEmail,
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    passwordMismatch,
    error, loading,
    handleRegister, goToLogin,
  };
}
