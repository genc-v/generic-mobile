import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { profileService } from '../services/profile.service';
import { authService } from '../services/auth.service';
import { Profile } from '../types/profile.types';

export function useProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.get()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
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

  return { profile, loading, initials, displayLabel, handleLogout, goToAccount, goToSecurity };
}
