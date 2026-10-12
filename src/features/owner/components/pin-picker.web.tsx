import { Body } from '@/components/ui/typography';
import { PinPickerFrame, type PinPickerProps } from '@/features/owner/components/pin-picker-frame';
import { useSurfaces } from '@/theme/surfaces';
import { useEffect, useState, type ComponentType } from 'react';
import { View } from 'react-native';

export function PinPicker({ lat, lng, radiusMeters, onChange }: PinPickerProps) {
  const { colors } = useSurfaces();
  const [MapView, setMapView] = useState<ComponentType<PinPickerProps> | null>(null);

  useEffect(() => {
    let alive = true;
    void import('./leaflet-map.web').then((mod) => {
      if (alive) setMapView(() => mod.LeafletMap);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <PinPickerFrame lat={lat} lng={lng} onChange={onChange}>
      {MapView ? (
        <MapView lat={lat} lng={lng} radiusMeters={radiusMeters} onChange={onChange} />
      ) : (
        <View style={{ height: 230, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mapBg }}>
          <Body size={14} color={colors.mute}>
            Loading map
          </Body>
        </View>
      )}
    </PinPickerFrame>
  );
}
