import { savePushToken } from '@/features/notifications/api';
import type { Profile } from '@/features/profile/schemas';
import Constants from 'expo-constants';
import { isRunningInExpoGo } from 'expo';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

const EXPO_GO_ANDROID_MESSAGE =
  'Push notifications need a Haunt development build. Expo Go on Android cannot receive them.';

export function pushAvailable(): boolean {
  return !(Platform.OS === 'android' && isRunningInExpoGo());
}

let loading: Promise<NotificationsModule | null> | null = null;

export function loadNotifications(): Promise<NotificationsModule | null> {
  if (Platform.OS === 'web' || !pushAvailable()) return Promise.resolve(null);
  if (!loading) {
    loading = import('expo-notifications').then((notifications) => {
      notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      return notifications;
    });
  }
  return loading;
}

const PROJECT_ID_PLACEHOLDER = 'YOUR_EAS_PROJECT_ID';

function usableProjectId(value: unknown): string | null {
  if (typeof value !== 'string' || value.length === 0 || value === PROJECT_ID_PLACEHOLDER) return null;
  return value;
}

function readProjectId(): string | null {
  const fromEas = usableProjectId(Constants.easConfig?.projectId);
  if (fromEas) return fromEas;

  const extra: unknown = Constants.expoConfig?.extra;
  if (!extra || typeof extra !== 'object' || !('eas' in extra)) return null;
  const eas = extra.eas;
  if (!eas || typeof eas !== 'object' || !('projectId' in eas)) return null;
  return usableProjectId(eas.projectId);
}

export async function enablePushNotifications(requestPermission: boolean): Promise<Profile> {
  if (Platform.OS === 'web') {
    throw new Error('Push notifications run in the Haunt app on iPhone and Android.');
  }
  if (!pushAvailable()) {
    throw new Error(EXPO_GO_ANDROID_MESSAGE);
  }
  if (!Device.isDevice) {
    throw new Error('Push notifications need a physical phone.');
  }

  const notifications = await loadNotifications();
  if (!notifications) {
    throw new Error(EXPO_GO_ANDROID_MESSAGE);
  }

  if (Platform.OS === 'android') {
    await notifications.setNotificationChannelAsync('default', {
      name: 'Haunt',
      importance: notifications.AndroidImportance.DEFAULT,
    });
  }

  const current = await notifications.getPermissionsAsync();
  const permission = current.granted
    ? current
    : requestPermission
      ? await notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: false, allowSound: true },
        })
      : current;

  if (!permission.granted) {
    throw new Error('Notifications stay off until you allow them.');
  }

  const projectId = readProjectId();
  if (!projectId) {
    throw new Error('This build has no Expo project id, so a push token cannot be created.');
  }

  const token = await notifications.getExpoPushTokenAsync({ projectId });
  return savePushToken(token.data);
}
