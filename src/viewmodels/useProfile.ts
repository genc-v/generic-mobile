import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { profileService } from '../services/profile.service';
import { authService } from '../services/auth.service';
import { cache, CACHE_KEYS } from '../utils/cache';
import { Profile } from '../types/profile.types';

export function useProfile() {
  const router = useRouter();
  const cached = cache.getSync<Profile>(CACHE_KEYS.profile) ?? null;
  const [profile, setProfile] = useState<Profile | null>(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let active = true;

    // Show the persisted copy instantly, then revalidate in the background.
    if (!cached) {
      cache.get<Profile>(CACHE_KEYS.profile).then(c => {
        if (active && c) { setProfile(c); setLoading(false); }
      });
    }

    profileService.get()
      .then(p => {
        if (!active) return;
        setProfile(p);
        cache.set(CACHE_KEYS.profile, p);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  function initials(): string {
    if (!profile) return 'ME';
    const first = profile.firstName?.[0] ?? '';
    const last = profile.lastName?.[0] ?? '';
    if (first || last) return `${first}${last}`.toUpperCase();
    return (profile.displayName?.[0] ?? 'U').toUpperCase();
  }

  function displayLabel(): string {
    if (!profile) return '';
    if (profile.displayName) return profile.displayName;
    if (profile.firstName || profile.lastName) {
      return `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
    }
    return profile.userId.slice(0, 8);
  }

  async function handleLogout() {
    await authService.logout();
    router.replace('/(auth)');
  }

  function goToAccount() {
    router.push('/(app)/profile/account');
  }

  function goToSecurity() {
    router.push('/(app)/profile/security');
  }

  function goToNotifications() {
    router.push('/(app)/profile/notifications');
  }

  return {
    profile,
    loading,
    initials,
    displayLabel,
    handleLogout,
    goToAccount,
    goToSecurity,
    goToNotifications,
  };
}
