import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

const ONBOARDED_KEY = 'hunt.onboarded';
const PERMS_ASKED_KEY = 'hunt.permsAsked';
/** Keys used before the rename to Hunt, so returning users skip onboarding again. */
const LEGACY_PREFIX = 'haunt.';

type LaunchFlags = {
  ready: boolean;
  onboarded: boolean;
  permsAsked: boolean;
  load: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  completePermissions: () => Promise<void>;
};

function legacyKey(key: string) {
  return LEGACY_PREFIX + key.slice(key.indexOf('.') + 1);
}

async function readFlag(key: string): Promise<boolean> {
  if (await SecureStore.isAvailableAsync()) {
    if ((await SecureStore.getItemAsync(key)) === '1') return true;
    if ((await SecureStore.getItemAsync(legacyKey(key))) !== '1') return false;
    await SecureStore.setItemAsync(key, '1');
    await SecureStore.deleteItemAsync(legacyKey(key)).catch(() => undefined);
    return true;
  }
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    if (localStorage.getItem(key) === '1') return true;
    if (localStorage.getItem(legacyKey(key)) !== '1') return false;
    localStorage.setItem(key, '1');
    localStorage.removeItem(legacyKey(key));
    return true;
  }
  return false;
}

async function writeFlag(key: string): Promise<void> {
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.setItemAsync(key, '1');
    return;
  }
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, '1');
  }
}

export const useLaunchFlags = create<LaunchFlags>((set) => ({
  ready: false,
  onboarded: false,
  permsAsked: false,

  load: async () => {
    const [onboarded, permsAsked] = await Promise.all([readFlag(ONBOARDED_KEY), readFlag(PERMS_ASKED_KEY)]);
    set({ ready: true, onboarded, permsAsked });
  },

  completeOnboarding: async () => {
    await writeFlag(ONBOARDED_KEY);
    set({ onboarded: true });
  },

  completePermissions: async () => {
    await writeFlag(PERMS_ASKED_KEY);
    set({ permsAsked: true });
  },
}));
