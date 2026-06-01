import { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import { authService } from '../services/auth.service';
import { DIGIT_COUNT } from '../components/ui/otp-input';

type Step = 'loading' | 'qr' | 'error';

export function useSetup2fa(visible: boolean, onEnabled: () => void) {
  const [step, setStep] = useState<Step>('loading');
  const [qrUri, setQrUri] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [code, setCode] = useState('');
  const [otpFocused, setOtpFocused] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setStep('loading');
    setCode('');
    setError(null);
    authService.setup2fa()
      .then(result => {
        if (result.success && result.data) {
          setQrUri(result.data.qrCodeSetupImageUrl);
          setManualKey(result.data.manualEntryKey);
          setStep('qr');
        } else {
          setStep('error');
        }
      })
      .catch(() => setStep('error'));
  }, [visible]);

  const formattedKey = manualKey.match(/.{1,4}/g)?.join(' ') ?? manualKey;

  async function handleCopy() {
    await Clipboard.setStringAsync(manualKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleConfirm() {
    if (code.length < DIGIT_COUNT) { setError('Enter the 6-digit code.'); return; }
    setError(null);
    setConfirming(true);
    try {
      const result = await authService.confirm2fa(code);
      if (result.success) {
        onEnabled();
      } else {
        setError('Invalid code. Please try again.');
        setCode('');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setCode('');
    } finally {
      setConfirming(false);
    }
  }

  return {
    step, qrUri, formattedKey, code, setCode,
    otpFocused, setOtpFocused,
    confirming, error, copied,
    handleCopy, handleConfirm,
  };
}
