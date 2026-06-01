import { useState, useRef, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../services/auth.service';
import { DIGIT_COUNT } from '../components/ui/otp-input';

export function useTwoFactor() {
  const router = useRouter();
  const { twoFactorId } = useLocalSearchParams<{ twoFactorId: string }>();
  const inputRef = useRef<TextInput>(null);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback((text: string) => {
    setCode(text.replace(/[^0-9]/g, '').slice(0, DIGIT_COUNT));
    setError(null);
  }, []);

  async function handleVerify() {
    if (code.length < DIGIT_COUNT) {
      setError('Enter the full 6-digit code.');
      return;
    }
    if (!twoFactorId) {
      setError('Session expired. Please log in again.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.verify2fa(twoFactorId, code);
      if (!result.success || !result.data) {
        setError('Invalid code. Please try again.');
        setCode('');
        inputRef.current?.focus();
        return;
      }
      router.replace('/(app)');
    } catch {
      setError('Something went wrong. Please try again.');
      setCode('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  function goToLogin() {
    router.replace('/(auth)/login');
  }

  return {
    inputRef, code, error, loading, focused,
    setFocused, handleChange, handleVerify, goToLogin,
  };
}
