import { queryKeys } from '@/api/keys';
import {
  fetchApprovedMedia,
  fetchNearbyVenues,
  fetchPromotionFeed,
  fetchVenuePerks,
  fetchVenuePromotions,
  fetchVenues,
} from '@/features/venues/api';
import type { Venue } from '@/features/venues/schemas';
import * as Location from 'expo-location';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

async function readGrantedLocation() {
  const permission = await Location.getForegroundPermissionsAsync();
  if (!permission.granted) return null;
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { lat: position.coords.latitude, lng: position.coords.longitude };
}

export function useUserLocation() {
  return useQuery({
    queryKey: queryKeys.location,
    retry: false,
    staleTime: 60_000,
    queryFn: async () => {
      try {
        return await Promise.race([
          readGrantedLocation(),
          new Promise<null>((resolve) => {
            setTimeout(() => resolve(null), 4000);
          }),
        ]);
      } catch {
        return null;
      }
    },
  });
}

/** City name for the header label; `null` when location is off or the lookup fails. */
export function useCityName(coords?: { lat: number; lng: number } | null) {
  const lat = coords ? Math.round(coords.lat * 100) / 100 : 0;
  const lng = coords ? Math.round(coords.lng * 100) / 100 : 0;
  return useQuery({
    queryKey: queryKeys.city(lat, lng),
    enabled: Boolean(coords) && Platform.OS !== 'web',
    staleTime: Infinity,
    retry: false,
    queryFn: async () => {
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        return place?.city || place?.subregion || place?.region || null;
      } catch {
        return null;
      }
    },
  });
}

export function useNearbyVenues(lat?: number, lng?: number) {
  return useQuery({
    queryKey: queryKeys.venuesNear(lat ?? 0, lng ?? 0),
    queryFn: () => fetchNearbyVenues(lat ?? 0, lng ?? 0),
    enabled: lat !== undefined && lng !== undefined,
  });
}

export function useAllVenues(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.venues,
    queryFn: fetchVenues,
    enabled,
  });
}

export function useExploreVenues(browseAll: boolean) {
  const client = useQueryClient();
  const location = useUserLocation();
  const coords = location.data;
  const nearby = useNearbyVenues(coords?.lat, coords?.lng);
  const fallback = browseAll || (location.isFetched && !coords) || nearby.isError;
  const all = useAllVenues(fallback);

  const waitingForNearby = Boolean(coords) && !browseAll && !nearby.isError && nearby.isPending;
  const isPending = browseAll
    ? all.isPending
    : location.isPending || waitingForNearby || (fallback && all.isPending);
  const isError = fallback ? all.isError : false;
  const isRefetching = location.isRefetching || (fallback ? all.isRefetching : nearby.isRefetching);
  const venues = fallback ? (all.data ?? []) : (nearby.data ?? []);

  const refetch = async () => {
    await location.refetch();
    if (fallback) await all.refetch();
    else await nearby.refetch();
  };

  return {
    venues,
    source: fallback ? ('all' as const) : ('near' as const),
    isPending,
    isRefetching,
    isError,
    refetch,
    locationOff: location.isFetched && !coords,
    enableLocation: async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) return;
      await client.invalidateQueries({ queryKey: queryKeys.location });
    },
  };
}

export function useVenue(venueId: string) {
  const venues = useAllVenues(true);
  const client = useQueryClient();
  const cached = client
    .getQueriesData<Venue[]>({ queryKey: ['venues'] })
    .flatMap(([, data]) => data ?? [])
    .find((item) => item.id === venueId);

  return {
    ...venues,
    venue: venues.data?.find((item) => item.id === venueId) ?? cached ?? null,
    isPending: venues.isPending && !cached,
    isError: venues.isError && !cached,
  };
}

export function useVenuePerks(venueId: string | null) {
  return useQuery({
    queryKey: queryKeys.venuePerks(venueId ?? ''),
    queryFn: () => fetchVenuePerks(venueId ?? ''),
    enabled: Boolean(venueId),
  });
}

export function usePromotionFeed() {
  return useQuery({ queryKey: queryKeys.promotionFeed, queryFn: fetchPromotionFeed });
}

export function useVenuePromotions(venueId: string | null) {
  return useQuery({
    queryKey: queryKeys.venuePromotions(venueId ?? ''),
    queryFn: () => fetchVenuePromotions(venueId ?? ''),
    enabled: Boolean(venueId),
  });
}

export function useVenueGallery(venueId: string) {
  return useQuery({
    queryKey: queryKeys.venueGallery(venueId),
    queryFn: () => fetchApprovedMedia(venueId),
    enabled: Boolean(venueId),
  });
}
