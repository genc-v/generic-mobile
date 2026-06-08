import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';

export function useForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.forgotPassword(email.trim());
      if (!result.success) {
        setError('Could not send reset email. Please try again.');
        return;
      }
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function goToResetPassword() {
    router.push('/(auth)/reset-password');
  }

  function goToLogin() {
    router.replace('/(auth)/login');
  }

  return {
    email, setEmail, error, loading, sent,
    handleSubmit, goToResetPassword, goToLogin,
  };
}
