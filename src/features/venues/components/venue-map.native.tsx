import type { Venue } from '@/features/venues/schemas';
import { useHauntColors } from '@/theme/colors';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type VenueMapProps = {
  venues: Venue[];
  latitude?: number;
  longitude?: number;
  onSelect: (venueId: string) => void;
};

export function VenueMap({ venues, latitude, longitude, onSelect }: VenueMapProps) {
  const colors = useHauntColors();
  const first = venues[0];

  return (
    <View className="mx-6 h-[220px] overflow-hidden rounded-3xl shadow-card" style={{ elevation: 4 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: latitude ?? first?.lat ?? 6.9271,
          longitude: longitude ?? first?.lng ?? 79.8612,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}>
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            coordinate={{ latitude: venue.lat, longitude: venue.lng }}
            title={venue.name}
            onPress={() => onSelect(venue.id)}
            tracksViewChanges={false}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.accent,
                borderWidth: 2,
                borderColor: colors.onAccent,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.onAccent }} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
