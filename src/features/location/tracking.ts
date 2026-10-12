import { GEOFENCE_TASK, LEGACY_GEOFENCE_TASK } from '@/features/location/geofence-task';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

const UPDATE_OPTIONS: Location.LocationTaskOptions = {
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: 50,
  timeInterval: 60_000,
  showsBackgroundLocationIndicator: true,
  foregroundService: {
    notificationTitle: 'Hunt',
    notificationBody: 'Checking when you arrive at a place.',
    notificationColor: '#FC6401',
  },
};

function isRunning(task: string): Promise<boolean> {
  return Location.hasStartedLocationUpdatesAsync(task).catch(() => false);
}

async function stopLegacyTask(): Promise<boolean> {
  if (!(await isRunning(LEGACY_GEOFENCE_TASK))) return false;
  await Location.stopLocationUpdatesAsync(LEGACY_GEOFENCE_TASK).catch(() => undefined);
  return true;
}

export async function isGeofenceActive(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (await isRunning(GEOFENCE_TASK)) return true;
  // Pre-rename installs: hand the running updates over to the new task name.
  if (await stopLegacyTask()) return startGeofenceUpdates();
  return false;
}

export async function startGeofenceUpdates(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const foreground = await Location.getForegroundPermissionsAsync();
  const background = await Location.getBackgroundPermissionsAsync();
  if (!foreground.granted || !background.granted) return false;

  await stopLegacyTask();
  if (!(await isRunning(GEOFENCE_TASK))) {
    await Location.startLocationUpdatesAsync(GEOFENCE_TASK, UPDATE_OPTIONS);
  }
  return true;
}

export async function stopGeofenceUpdates(): Promise<void> {
  if (Platform.OS === 'web') return;
  await stopLegacyTask();
  if (!(await isRunning(GEOFENCE_TASK))) return;
  await Location.stopLocationUpdatesAsync(GEOFENCE_TASK);
}
