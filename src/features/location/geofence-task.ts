import { api } from '@/api/client';
import { isAxiosError } from 'axios';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const GEOFENCE_TASK = 'haunt-geofence-check';

type GeofenceTaskData = {
  locations?: Location.LocationObject[];
};

TaskManager.defineTask<GeofenceTaskData>(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) return;
  const latest = data?.locations?.at(-1);
  if (!latest) return;

  try {
    await api.post('/notifications/geofence-check', {
      lat: latest.coords.latitude,
      lng: latest.coords.longitude,
    });
  } catch (requestError) {
    if (isAxiosError(requestError) && requestError.response?.status === 403) {
      await Location.stopLocationUpdatesAsync(GEOFENCE_TASK).catch(() => undefined);
    }
  }
});
