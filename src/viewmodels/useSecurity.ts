import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { cache, CACHE_KEYS } from '../utils/cache';
import { toast } from '../utils/toast';

type CachedAccount = { email: string; username: string; hasTwoFactorAuth: boolean };

export function useSecurity() {
  const cached = cache.getSync<CachedAccount>(CACHE_KEYS.account) ?? null;

  const [loadingAccount, setLoadingAccount] = useState(!cached);
  const [email, setEmail] = useState(cached?.email ?? '');
  const [username, setUsername] = useState(cached?.username ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [twoFaEnabled, setTwoFaEnabled] = useState(cached?.hasTwoFactorAuth ?? false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);

  useEffect(() => {
    let active = true;

    if (!cached) {
      cache.get<CachedAccount>(CACHE_KEYS.account).then(c => {
        if (active && c) {
          setEmail(c.email);
          setUsername(c.username);
          setTwoFaEnabled(c.hasTwoFactorAuth);
          setLoadingAccount(false);
        }
      });
    }

    authService.getAccount()
      .then(res => {
        if (!active || !res.success || !res.data) return;
        setEmail(res.data.email);
        setUsername(res.data.username);
        setTwoFaEnabled(res.data.hasTwoFactorAuth);
        cache.set(CACHE_KEYS.account, {
          email: res.data.email,
          username: res.data.username,
          hasTwoFactorAuth: res.data.hasTwoFactorAuth,
        });
      })
      .catch(() => {})
      .finally(() => { if (active) setLoadingAccount(false); });

    return () => { active = false; };
  }, []);

  async function handleSaveAccount() {
    setSaveSuccess(false);
    setSaving(true);
    try {
      const body: Record<string, string> = { email, username, currentPassword: currentPassword || '', newPassword: newPassword || '' };
      const result = await authService.updateAccount(body);
      if (result.success) {
        cache.set(CACHE_KEYS.account, { email, username, hasTwoFactorAuth: twoFaEnabled });
        setSaveSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        toast.error('Failed to update account.');
      }
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update account.');
    } finally {
      setSaving(false);
    }
  }

  function updateTwoFaCache(enabled: boolean) {
    const prev = cache.getSync<CachedAccount>(CACHE_KEYS.account);
    if (prev) cache.set(CACHE_KEYS.account, { ...prev, hasTwoFactorAuth: enabled });
  }

  function handleEnabled() {
    setShowSetup(false);
    setTwoFaEnabled(true);
    updateTwoFaCache(true);
  }

  function handleDisabled() {
    setShowDisable(false);
    setTwoFaEnabled(false);
    updateTwoFaCache(false);
  }

  return {
    loadingAccount,
    email, setEmail,
    username, setUsername,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    saving, saveSuccess,
    twoFaEnabled,
    showSetup, setShowSetup,
    showDisable, setShowDisable,
    handleSaveAccount, handleEnabled, handleDisabled,
  };
}
