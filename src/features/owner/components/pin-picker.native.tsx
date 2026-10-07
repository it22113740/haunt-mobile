import { useHauntColors } from '@/theme/colors';
import { Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

type PinPickerProps = {
  lat: number;
  lng: number;
  radiusMeters: number;
  onChange: (pin: { lat: number; lng: number }) => void;
};

export function PinPicker({ lat, lng, radiusMeters, onChange }: PinPickerProps) {
  const delta = Math.max((radiusMeters / 111000) * 6, 0.01);
  const colors = useHauntColors();

  return (
    <>
      <View className="overflow-hidden rounded-3xl">
      <MapView
        style={{ height: 240, width: '100%' }}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: delta,
          longitudeDelta: delta,
        }}
        onPress={(event) =>
          onChange({
            lat: event.nativeEvent.coordinate.latitude,
            lng: event.nativeEvent.coordinate.longitude,
          })
        }>
        <Circle
          center={{ latitude: lat, longitude: lng }}
          radius={radiusMeters}
          strokeColor={colors.accent}
          fillColor={`${colors.accent}33`}
        />
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          draggable
          onDragEnd={(event) =>
            onChange({
              lat: event.nativeEvent.coordinate.latitude,
              lng: event.nativeEvent.coordinate.longitude,
            })
          }
        />
      </MapView>
      </View>
      <Text className="mt-3 text-sm text-haunt-mute">Drag the pin. The circle is where a visit counts.</Text>
    </>
  );
}
