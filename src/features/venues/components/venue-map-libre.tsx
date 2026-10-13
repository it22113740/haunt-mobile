import { MapPin, sketchMapStyle } from '@/features/venues/components/map-style';
import { distanceMeters, type Venue } from '@/features/venues/schemas';
import { useHuntColors, type HuntColors } from '@/theme/colors';
import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

type VenueMapProps = {
  venues: Venue[];
  latitude?: number;
  longitude?: number;
  onSelect: (venueId: string) => void;
  height?: number;
};

const LABEL_WIDTH = 120;
const PIN_WIDTH = 30;

export function VenueMapLibre({ venues, latitude, longitude, onSelect, height = 210 }: VenueMapProps) {
  const colors = useHuntColors();
  const mapStyle = useMemo(() => sketchMapStyle(colors), [colors]);
  const user = latitude !== undefined && longitude !== undefined ? { lat: latitude, lng: longitude } : null;
  const nearest = user
    ? venues.reduce<Venue | undefined>(
        (best, venue) => (!best || distanceMeters(user, venue) < distanceMeters(user, best) ? venue : best),
        undefined,
      )
    : venues[0];

  return (
    <View style={{ height, backgroundColor: colors.mapBg }}>
      <Map
        style={{ flex: 1 }}
        mapStyle={mapStyle}
        androidView="texture"
        logo={false}
        compass={false}
        attributionPosition={{ bottom: 6, right: 6 }}
        touchRotate={false}
        touchPitch={false}
        accessibilityLabel={`Map with ${venues.length} ${venues.length === 1 ? 'place' : 'places'}`}>
        <Camera
          initialViewState={{
            center: [longitude ?? nearest?.lng ?? 79.8612, latitude ?? nearest?.lat ?? 6.9271],
            zoom: 13,
          }}
        />
        {user && nearest ? (
          <GeoJSONSource
            id="route-to-nearest"
            data={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [user.lng, user.lat],
                  [nearest.lng, nearest.lat],
                ],
              },
            }}>
            <Layer
              id="route-to-nearest-line"
              type="line"
              paint={{ 'line-color': colors.ink, 'line-width': 1.4, 'line-dasharray': [2, 3] }}
            />
          </GeoJSONSource>
        ) : null}
        {user ? (
          <Marker id="you" lngLat={[user.lng, user.lat]} accessibilityLabel="You are here">
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
      </Map>
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
  return (
    <Marker
      id={`venue-${venue.id}`}
      lngLat={[venue.lng, venue.lat]}
      anchor="bottom"
      onPress={onPress}
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
