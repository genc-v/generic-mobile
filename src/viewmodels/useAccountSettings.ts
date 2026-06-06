import { useState, useEffect } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { profileService } from '../services/profile.service';
import { cache, CACHE_KEYS } from '../utils/cache';
import { Profile } from '../types/profile.types';

export function useAccountSettings() {
  const cached = cache.getSync<Profile>(CACHE_KEYS.profile) ?? null;
  const [fetching, setFetching] = useState(!cached);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(cached?.displayName ?? '');
  const [firstName, setFirstName] = useState(cached?.firstName ?? '');
  const [lastName, setLastName] = useState(cached?.lastName ?? '');
  const [bio, setBio] = useState(cached?.bio ?? '');
  const [phoneNumber, setPhoneNumber] = useState(cached?.phoneNumber ?? '');
  const [timezone, setTimezone] = useState(cached?.timezone ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(cached?.avatarUrl ?? null);

  function populate(p: Profile) {
    setDisplayName(p.displayName ?? '');
    setFirstName(p.firstName ?? '');
    setLastName(p.lastName ?? '');
    setBio(p.bio ?? '');
    setPhoneNumber(p.phoneNumber ?? '');
    setTimezone(p.timezone ?? '');
    setAvatarUrl(p.avatarUrl ?? null);
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

  async function uploadFromDevice() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setUploading(true);
    setError(null);
    try {
      const url = await profileService.uploadAvatar({
        uri: asset.uri,
        name: asset.fileName ?? `avatar-${Date.now()}.jpg`,
        type: asset.mimeType ?? 'image/jpeg',
      });
      setAvatarUrl(url);
      await profileService.update({ displayName, firstName, lastName, bio, phoneNumber, timezone, avatarUrl: url });
      const prev = cache.getSync<Profile>(CACHE_KEYS.profile);
      if (prev) cache.set(CACHE_KEYS.profile, { ...prev, avatarUrl: url });
    } catch {
      setError('Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveAvatar() {
    setAvatarUrl(null);
    try {
      await profileService.update({ displayName, firstName, lastName, bio, phoneNumber, timezone, avatarUrl: '' });
      const prev = cache.getSync<Profile>(CACHE_KEYS.profile);
      if (prev) cache.set(CACHE_KEYS.profile, { ...prev, avatarUrl: null });
    } catch {
      setError('Failed to remove photo.');
    }
  }

  function handlePickAvatar() {
    const options = avatarUrl
      ? ['Upload new photo', 'Remove photo', 'Cancel']
      : ['Upload photo', 'Cancel'];
    const cancelIndex = options.length - 1;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: cancelIndex, destructiveButtonIndex: avatarUrl ? 1 : undefined },
        i => {
          if (i === 0) uploadFromDevice();
          else if (i === 1 && avatarUrl) handleRemoveAvatar();
        },
      );
    } else {
      const buttons: Parameters<typeof Alert.alert>[2] = [
        { text: avatarUrl ? 'Upload new photo' : 'Upload photo', onPress: uploadFromDevice },
      ];
      if (avatarUrl) buttons.push({ text: 'Remove photo', style: 'destructive', onPress: handleRemoveAvatar });
      buttons.push({ text: 'Cancel', style: 'cancel' });
      Alert.alert('Profile photo', undefined, buttons);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await profileService.update({ displayName, firstName, lastName, bio, phoneNumber, timezone, avatarUrl: avatarUrl ?? '' });
      const prev = cache.getSync<Profile>(CACHE_KEYS.profile);
      if (prev) cache.set(CACHE_KEYS.profile, { ...prev, displayName, firstName, lastName, bio, phoneNumber, timezone, avatarUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return {
    fetching, saving, uploading, success, error,
    avatarUrl,
    displayName, setDisplayName,
    firstName, setFirstName,
    lastName, setLastName,
    bio, setBio,
    phoneNumber, setPhoneNumber,
    timezone, setTimezone,
    handlePickAvatar,
    handleSave,
  };
}
