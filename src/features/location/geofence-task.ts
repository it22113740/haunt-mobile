import { api } from '@/api/client';
import { isAxiosError } from 'axios';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const GEOFENCE_TASK = 'hunt-geofence-check';
/** Task name from before the rename to Hunt. Installs that still run it get it stopped and replaced. */
export const LEGACY_GEOFENCE_TASK = 'haunt-geofence-check';

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

TaskManager.defineTask(LEGACY_GEOFENCE_TASK, async () => {
  await Location.stopLocationUpdatesAsync(LEGACY_GEOFENCE_TASK).catch(() => undefined);
});
