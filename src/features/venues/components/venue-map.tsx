import { Illustration } from '@/components/illustration';
import type { Venue } from '@/features/venues/schemas';
import { Text, View } from 'react-native';

type VenueMapProps = {
  venues: Venue[];
  latitude?: number;
  longitude?: number;
  onSelect: (venueId: string) => void;
};

export function VenueMap(_props: VenueMapProps) {
  return (
    <View
      className="mx-6 h-[220px] items-center justify-center overflow-hidden rounded-3xl bg-haunt-blush shadow-card"
      style={{ elevation: 4 }}>
      <Illustration name="onb-discover" size={112} />
      <Text className="mt-2 font-sans text-caption text-haunt-ink">Open the app to see the map</Text>
    </View>
  );
}
