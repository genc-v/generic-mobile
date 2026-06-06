import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { profileService } from '../services/profile.service';
import { Profile } from '../types/profile.types';
import { cache, CACHE_KEYS } from '../utils/cache';

export function useProfile() {
  const router = useRouter();
  const cached = cache.getSync<Profile>(CACHE_KEYS.profile) ?? null;
  const [profile, setProfile] = useState<Profile | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [isAdmin, setIsAdmin] = useState(cache.getSync<boolean>(CACHE_KEYS.isAdmin) ?? false);

  useEffect(() => {
    let active = true;

    // Show the persisted copy instantly, then revalidate in the background.
    if (!cached) {
      cache.get<Profile>(CACHE_KEYS.profile).then(c => {
        if (active && c) { setProfile(c); setLoading(false); }
      });
    }

    cache.get<boolean>(CACHE_KEYS.isAdmin).then(v => {
      if (active && v != null) setIsAdmin(v);
    });

    profileService.get()
      .then(p => {
        if (!active) return;
        setProfile(p);
        cache.set(CACHE_KEYS.profile, p);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });

    // Determine admin status from the role claim carried in the JWT.
    authService.isAdmin()
      .then(admin => {
        if (!active) return;
        setIsAdmin(admin);
        cache.set(CACHE_KEYS.isAdmin, admin);
      })
      .catch(() => {});

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
    router.replace('/(auth)/login');
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

  function goToManageUsers() {
    router.push('/(app)/profile/manage-users');
  }

  return {
    profile,
    avatarUrl: profile?.avatarUrl ?? null,
    loading,
    isAdmin,
    initials,
    displayLabel,
    handleLogout,
    goToAccount,
    goToSecurity,
    goToNotifications,
    goToManageUsers,
  };
}
