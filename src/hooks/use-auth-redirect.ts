import { useLaunchFlags } from '@/lib/launch-flags';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function useAuthRedirect() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const flagsReady = useLaunchFlags((state) => state.ready);
  const onboarded = useLaunchFlags((state) => state.onboarded);
  const permsAsked = useLaunchFlags((state) => state.permsAsked);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated || !flagsReady) return;

    const group = segments[0];
    if (!onboarded) {
      if (group !== '(onboarding)') router.replace('/(onboarding)');
      return;
    }

    if (group !== '(auth)' && group !== '(owner)' && group !== '(user)') return;

    if (!token) {
      if (group !== '(auth)') router.replace('/(auth)/login');
      return;
    }

    if (!role) return;

    if (role === 'OWNER' && group !== '(owner)') {
      router.replace('/(owner)/(tabs)');
      return;
    }

    if (role === 'USER') {
      if (!permsAsked) {
        if ((segments as string[])[1] !== 'permissions') router.replace('/(user)/permissions');
        return;
      }
      if (group !== '(user)') router.replace('/(user)/(tabs)');
    }
  }, [flagsReady, isHydrated, onboarded, permsAsked, role, router, segments, token]);
}
