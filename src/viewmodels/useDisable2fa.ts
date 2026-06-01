import { useState } from 'react';
import { authService } from '../services/auth.service';
import { DIGIT_COUNT } from '../components/ui/otp-input';

export function useDisable2fa(onDisabled: () => void, onClose: () => void) {
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setCode('');
    setError(null);
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleDisable() {
    if (code.length < DIGIT_COUNT) { setError('Enter the 6-digit code.'); return; }
    setError(null);
    setLoading(true);
    try {
      const result = await authService.disable2fa(code);
      if (result.success) {
        reset();
        onDisabled();
      } else {
        setError('Invalid code. Please try again.');
        setCode('');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setCode('');
    } finally {
      setLoading(false);
    }
  }

  return { code, setCode, focused, setFocused, loading, error, handleClose, handleDisable };
}
