import AsyncStorage from '@react-native-async-storage/async-storage';

// Lightweight JSON cache with an in-memory layer for instant synchronous reads
// and AsyncStorage for persistence across launches. Used for stale-while-revalidate:
// show the cached value immediately, then refresh from the network in the background.
const mem = new Map<string, unknown>();

export const cache = {
  // Synchronous read — only hits the in-memory layer (populated after the first
  // get/set in this session). Lets a screen render instantly without a tick.
  getSync<T>(key: string): T | undefined {
    return mem.get(key) as T | undefined;
  },

  async get<T>(key: string): Promise<T | undefined> {
    if (mem.has(key)) return mem.get(key) as T;
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw == null) return undefined;
      const value = JSON.parse(raw) as T;
      mem.set(key, value);
      return value;
    } catch {
      return undefined;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    mem.set(key, value);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore persistence failures — the in-memory copy still works this session
    }
  },

  async remove(key: string): Promise<void> {
    mem.delete(key);
    try {
      await AsyncStorage.removeItem(key);
    } catch {
    }
  },

  // Wipe all cached entries — call on logout so the next user starts clean.
  async clearAll(): Promise<void> {
    mem.clear();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const ours = keys.filter(k => k.startsWith('cache_'));
      if (ours.length) await AsyncStorage.multiRemove(ours);
    } catch {
      // ignore
    }
  },
};

export const CACHE_KEYS = {
  profile: 'cache_profile',
  account: 'cache_account',
  isAdmin: 'cache_is_admin',
  org: (orgId: string) => `cache_org_${orgId}`,
  orgRole: (orgId: string) => `cache_org_role_${orgId}`,
};
