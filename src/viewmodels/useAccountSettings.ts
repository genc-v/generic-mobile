import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import { cache, CACHE_KEYS } from '../utils/cache';
import { Profile } from '../types/profile.types';

export function useAccountSettings() {
  const cached = cache.getSync<Profile>(CACHE_KEYS.profile) ?? null;
  const [fetching, setFetching] = useState(!cached);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(cached?.displayName ?? '');
  const [firstName, setFirstName] = useState(cached?.firstName ?? '');
  const [lastName, setLastName] = useState(cached?.lastName ?? '');
  const [bio, setBio] = useState(cached?.bio ?? '');
  const [phoneNumber, setPhoneNumber] = useState(cached?.phoneNumber ?? '');
  const [timezone, setTimezone] = useState(cached?.timezone ?? '');

  function populate(p: Profile) {
    setDisplayName(p.displayName ?? '');
    setFirstName(p.firstName ?? '');
    setLastName(p.lastName ?? '');
    setBio(p.bio ?? '');
    setPhoneNumber(p.phoneNumber ?? '');
    setTimezone(p.timezone ?? '');
  }

  useEffect(() => {
    let active = true;

    if (!cached) {
      cache.get<Profile>(CACHE_KEYS.profile).then(c => {
        if (active && c) { populate(c); setFetching(false); }
      });
    }

    profileService.get()
      .then(p => {
        if (!active) return;
        populate(p);
        cache.set(CACHE_KEYS.profile, p);
      })
      .catch(() => { if (active) setError('Failed to load profile.'); })
      .finally(() => { if (active) setFetching(false); });

    return () => { active = false; };
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await profileService.update({ displayName, firstName, lastName, bio, phoneNumber, timezone, avatarUrl: '' });
      const prev = cache.getSync<Profile>(CACHE_KEYS.profile);
      if (prev) cache.set(CACHE_KEYS.profile, { ...prev, displayName, firstName, lastName, bio, phoneNumber, timezone });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return {
    fetching, saving, success, error,
    displayName, setDisplayName,
    firstName, setFirstName,
    lastName, setLastName,
    bio, setBio,
    phoneNumber, setPhoneNumber,
    timezone, setTimezone,
    handleSave,
  };
}
