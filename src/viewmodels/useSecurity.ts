import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

export function useSecurity() {
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);

  useEffect(() => {
    authService.getAccount()
      .then(res => {
        if (res.success && res.data) {
          setEmail(res.data.email);
          setUsername(res.data.username);
          setTwoFaEnabled(res.data.hasTwoFactorAuth);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAccount(false));
  }, []);

  async function handleSaveAccount() {
    if (!currentPassword) { setSaveError('Current password is required to save changes.'); return; }
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);
    try {
      const body: Record<string, string> = { email, username, currentPassword };
      if (newPassword) body.newPassword = newPassword;
      const result = await authService.updateAccount(body);
      if (result.success) {
        setSaveSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        setSaveError('Failed to update account.');
      }
    } catch {
      setSaveError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleEnabled() {
    setShowSetup(false);
    setTwoFaEnabled(true);
  }

  function handleDisabled() {
    setShowDisable(false);
    setTwoFaEnabled(false);
  }

  return {
    loadingAccount,
    email, setEmail,
    username, setUsername,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    saving, saveError, saveSuccess,
    twoFaEnabled,
    showSetup, setShowSetup,
    showDisable, setShowDisable,
    handleSaveAccount, handleEnabled, handleDisabled,
  };
}
