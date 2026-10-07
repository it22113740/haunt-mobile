import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

const ONBOARDED_KEY = 'haunt.onboarded';
const PERMS_ASKED_KEY = 'haunt.permsAsked';

type LaunchFlags = {
  ready: boolean;
  onboarded: boolean;
  permsAsked: boolean;
  load: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  completePermissions: () => Promise<void>;
};

async function readFlag(key: string): Promise<boolean> {
  if (await SecureStore.isAvailableAsync()) {
    return (await SecureStore.getItemAsync(key)) === '1';
  }
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(key) === '1';
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
