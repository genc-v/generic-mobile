import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';
import { DIGIT_COUNT } from '../components/ui/otp-input';

type Step = 'code' | 'password';

export function useResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('code');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleCodeChange = useCallback((text: string) => {
    setCode(text.replace(/[^0-9]/g, '').slice(0, DIGIT_COUNT));
    setError(null);
  }, []);

  function handleContinue() {
    if (code.length < DIGIT_COUNT) {
      setError('Enter the full 6-digit code.');
      return;
    }
    setError(null);
    setStep('password');
  }

  async function handleReset() {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (passwordMismatch) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.resetPassword(code, newPassword);
      if (!result.success) {
        setError('The code was not correct.');
        setStep('code');
        setCode('');
        return;
      }
      setSuccess(true);
    } catch {
      setError('The code was not correct.');
      setStep('code');
      setCode('');
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    if (step === 'password') {
      setStep('code');
      setError(null);
      setNewPassword('');
      setConfirmPassword('');
    } else {
      router.back();
    }
  }

  function goToLogin() {
    router.replace('/(auth)/login');
  }

  return {
    step, code, focused, setFocused, handleCodeChange,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword, passwordMismatch,
    error, loading, success,
    handleContinue, handleReset, goBack, goToLogin,
  };
}
