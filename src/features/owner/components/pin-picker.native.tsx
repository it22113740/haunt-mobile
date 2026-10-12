import { PinPickerFrame, type PinPickerProps } from '@/features/owner/components/pin-picker-frame';
import { MapPin, sketchStyle } from '@/features/venues/components/map-style';
import { useHuntColors } from '@/theme/colors';
import { Platform } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';

export function PinPicker({ lat, lng, radiusMeters, onChange }: PinPickerProps) {
  const delta = Math.max((radiusMeters / 111000) * 6, 0.01);
  const colors = useHuntColors();

  return (
    <PinPickerFrame lat={lat} lng={lng} onChange={onChange}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ height: 230, width: '100%', backgroundColor: colors.mapBg }}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
        customMapStyle={Platform.OS === 'android' ? sketchStyle(colors) : undefined}
        showsPointsOfInterests={false}
        toolbarEnabled={false}
        accessibilityLabel="Map with a pin and the check-in circle. Drag the pin to your door."
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
          strokeColor={colors.accentDeep}
          strokeWidth={1.5}
          lineDashPattern={[5, 4]}
          fillColor="rgba(252,100,1,0.12)"
        />
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          anchor={{ x: 0.5, y: 1 }}
          draggable
          onDragEnd={(event) =>
            onChange({
              lat: event.nativeEvent.coordinate.latitude,
              lng: event.nativeEvent.coordinate.longitude,
            })
          }>
          <MapPin colors={colors} />
        </Marker>
      </MapView>
    </PinPickerFrame>
  );
}
