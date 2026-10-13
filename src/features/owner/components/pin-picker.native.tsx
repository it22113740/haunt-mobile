import { PinPickerFrame, type PinPickerProps } from '@/features/owner/components/pin-picker-frame';
import { Mono } from '@/components/ui/typography';
import { SketchMap } from '@/features/venues/components/sketch-map';
import { isExpoGo } from '@/lib/expo-go';
import { useHuntColors } from '@/theme/colors';
import { lazy, Suspense } from 'react';
import { View } from 'react-native';

// Loaded lazily: MapLibre's native module is missing from Expo Go and throws on import.
const PinPickerLibre = lazy(() =>
  import('@/features/owner/components/pin-picker-libre').then((module) => ({ default: module.PinPickerLibre })),
);

export function PinPicker(props: PinPickerProps) {
  const colors = useHuntColors();

  if (isExpoGo) {
    return (
      <PinPickerFrame lat={props.lat} lng={props.lng} onChange={props.onChange} typedByDefault>
        <View>
          <SketchMap height={230} />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 10,
              right: 10,
              bottom: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.line,
            }}>
            <Mono size={11}>Preview only in Expo Go. Type the coordinates below.</Mono>
          </View>
        </View>
      </PinPickerFrame>
    );
  }
  return (
    <Suspense fallback={<View style={{ height: 230, backgroundColor: colors.mapBg }} />}>
      <PinPickerLibre {...props} />
    </Suspense>
  );
}
