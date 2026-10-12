import { MapPin, sketchStyle } from '@/features/venues/components/map-style';
import { distanceMeters, type Venue } from '@/features/venues/schemas';
import { useHuntColors, type HuntColors } from '@/theme/colors';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

type VenueMapProps = {
  venues: Venue[];
  latitude?: number;
  longitude?: number;
  onSelect: (venueId: string) => void;
  height?: number;
};

const LABEL_WIDTH = 120;
const PIN_WIDTH = 30;

export function VenueMap({ venues, latitude, longitude, onSelect, height = 210 }: VenueMapProps) {
  const colors = useHuntColors();
  const user = latitude !== undefined && longitude !== undefined ? { lat: latitude, lng: longitude } : null;
  const nearest = user
    ? venues.reduce<Venue | undefined>(
        (best, venue) => (!best || distanceMeters(user, venue) < distanceMeters(user, best) ? venue : best),
        undefined,
      )
    : venues[0];

  return (
    <View style={{ height, backgroundColor: colors.mapBg }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
        customMapStyle={Platform.OS === 'android' ? sketchStyle(colors) : undefined}
        showsPointsOfInterests={false}
        toolbarEnabled={false}
        accessibilityLabel={`Map with ${venues.length} ${venues.length === 1 ? 'place' : 'places'}`}
        initialRegion={{
          latitude: latitude ?? nearest?.lat ?? 6.9271,
          longitude: longitude ?? nearest?.lng ?? 79.8612,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}>
        {user && nearest ? (
          <Polyline
            coordinates={[
              { latitude: user.lat, longitude: user.lng },
              { latitude: nearest.lat, longitude: nearest.lng },
            ]}
            strokeColor={colors.ink}
            strokeWidth={1.4}
            lineDashPattern={[3, 4]}
          />
        ) : null}
        {user ? (
          <Marker
            coordinate={{ latitude: user.lat, longitude: user.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
            accessibilityLabel="You are here">
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: colors.card,
                borderWidth: 1.6,
                borderColor: colors.ink,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.ink }} />
            </View>
          </Marker>
        ) : null}
        {venues.map((venue) => (
          <VenueMarker
            key={venue.id}
            venue={venue}
            primary={venue.id === nearest?.id}
            colors={colors}
            onPress={() => onSelect(venue.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

/** Pin with its handwritten name to the right; the empty left column keeps the pin tip on the anchor. */
function VenueMarker({
  venue,
  primary,
  colors,
  onPress,
}: {
  venue: Venue;
  primary: boolean;
  colors: HuntColors;
  onPress: () => void;
}) {
  // Android snapshots custom marker views; keep tracking briefly so the label font has rendered first.
  const [tracking, setTracking] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setTracking(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      coordinate={{ latitude: venue.lat, longitude: venue.lng }}
      anchor={{ x: 0.5, y: 1 }}
      onPress={onPress}
      tracksViewChanges={tracking}
      accessibilityLabel={venue.name}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ width: LABEL_WIDTH }} />
        <View style={{ width: PIN_WIDTH }}>
          <MapPin colors={colors} size={PIN_WIDTH} />
        </View>
        <Text
          numberOfLines={1}
          style={{
            width: LABEL_WIDTH,
            paddingLeft: 3,
            marginTop: 2,
            fontFamily: 'Caveat_600SemiBold',
            fontSize: primary ? 20 : 18,
            color: primary ? colors.accentDeep : colors.mute,
          }}>
          {venue.name}
        </Text>
      </View>
    </Marker>
  );
}
