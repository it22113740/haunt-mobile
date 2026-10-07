import { queryKeys } from '@/api/keys';
import { queryClient } from '@/api/query-client';
import { startGeofenceUpdates } from '@/features/location/tracking';
import { sendTestPush } from '@/features/notifications/api';
import { enablePushNotifications, loadNotifications } from '@/features/notifications/push';
import type { Profile } from '@/features/profile/schemas';
import { useAuthStore } from '@/stores/auth';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';

function cacheProfile(profile: Profile) {
  queryClient.setQueryData(queryKeys.profile, profile);
}

export function useEnablePush() {
  return useMutation({
    mutationFn: () => enablePushNotifications(true),
    onSuccess: cacheProfile,
  });
}

export function useTestPush() {
  return useMutation({
    mutationFn: sendTestPush,
  });
}

export function useDeviceServices() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated || !token || Platform.OS === 'web') return;

    let cancelled = false;

    void (async () => {
      try {
        const notifications = await loadNotifications();
        if (notifications && !cancelled) {
          const permission = await notifications.getPermissionsAsync();
          if (!cancelled && permission.granted) {
            cacheProfile(await enablePushNotifications(false));
          }
        }
      } catch {
        // The profile screen explains why a token could not be saved.
      }

      if (!cancelled && role === 'USER') {
        await startGeofenceUpdates().catch(() => false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, role, token]);
}
