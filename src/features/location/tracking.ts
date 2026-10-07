import { GEOFENCE_TASK } from '@/features/location/geofence-task';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

const UPDATE_OPTIONS: Location.LocationTaskOptions = {
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: 50,
  timeInterval: 60_000,
  showsBackgroundLocationIndicator: true,
  foregroundService: {
    notificationTitle: 'Haunt',
    notificationBody: 'Checking when you arrive at a place.',
    notificationColor: '#C4512C',
  },
};

export async function startGeofenceUpdates(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const foreground = await Location.getForegroundPermissionsAsync();
  const background = await Location.getBackgroundPermissionsAsync();
  if (!foreground.granted || !background.granted) return false;

  const started = await Location.hasStartedLocationUpdatesAsync(GEOFENCE_TASK).catch(() => false);
  if (!started) {
    await Location.startLocationUpdatesAsync(GEOFENCE_TASK, UPDATE_OPTIONS);
  }
  return true;
}

export async function stopGeofenceUpdates(): Promise<void> {
  if (Platform.OS === 'web') return;
  const started = await Location.hasStartedLocationUpdatesAsync(GEOFENCE_TASK).catch(() => false);
  if (!started) return;
  await Location.stopLocationUpdatesAsync(GEOFENCE_TASK);
}
