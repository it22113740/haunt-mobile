import { SketchMap } from '@/features/venues/components/sketch-map';
import type { Venue } from '@/features/venues/schemas';
import { isExpoGo } from '@/lib/expo-go';
import { useHuntColors } from '@/theme/colors';
import { lazy, Suspense } from 'react';
import { View } from 'react-native';

type VenueMapProps = {
  venues: Venue[];
  latitude?: number;
  longitude?: number;
  onSelect: (venueId: string) => void;
  height?: number;
};

// Loaded lazily: MapLibre's native module is missing from Expo Go and throws on import.
const VenueMapLibre = lazy(() =>
  import('@/features/venues/components/venue-map-libre').then((module) => ({ default: module.VenueMapLibre })),
);

export function VenueMap(props: VenueMapProps) {
  const colors = useHuntColors();
  const height = props.height ?? 210;

  if (isExpoGo) {
    return <SketchMap height={height} primary={props.venues[0]?.name} secondary={props.venues[1]?.name} />;
  }
  return (
    <Suspense fallback={<View style={{ height, backgroundColor: colors.mapBg }} />}>
      <VenueMapLibre {...props} />
    </Suspense>
  );
}
