import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import { Profile } from '../types/profile.types';

export function useAccountSettings() {
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timezone, setTimezone] = useState('');

  function populate(p: Profile) {
    setDisplayName(p.displayName ?? '');
    setFirstName(p.firstName ?? '');
    setLastName(p.lastName ?? '');
    setBio(p.bio ?? '');
    setPhoneNumber(p.phoneNumber ?? '');
    setTimezone(p.timezone ?? '');
  }

  useEffect(() => {
    profileService.get()
      .then(populate)
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setFetching(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await profileService.update({ displayName, firstName, lastName, bio, phoneNumber, timezone, avatarUrl: '' });
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
