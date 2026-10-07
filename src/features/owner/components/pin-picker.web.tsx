import { TextField } from '@/features/auth/components/text-field';
import { useEffect, useState, type ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';

type PinPickerProps = {
  lat: number;
  lng: number;
  radiusMeters: number;
  onChange: (pin: { lat: number; lng: number }) => void;
};

function parseCoord(text: string) {
  if (!/^-?\d*\.?\d*$/.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

export function PinPicker({ lat, lng, radiusMeters, onChange }: PinPickerProps) {
  const [MapView, setMapView] = useState<ComponentType<PinPickerProps> | null>(null);
  const [open, setOpen] = useState(false);
  const [latText, setLatText] = useState(String(lat));
  const [lngText, setLngText] = useState(String(lng));

  useEffect(() => {
    let alive = true;
    void import('./leaflet-map.web').then((mod) => {
      if (alive) setMapView(() => mod.LeafletMap);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setLatText((current) => (Number(current) === lat ? current : String(lat)));
  }, [lat]);

  useEffect(() => {
    setLngText((current) => (Number(current) === lng ? current : String(lng)));
  }, [lng]);

  return (
    <View>
      {MapView ? (
        <MapView lat={lat} lng={lng} radiusMeters={radiusMeters} onChange={onChange} />
      ) : (
        <View className="h-60 items-center justify-center rounded-3xl bg-haunt-blush">
          <Text className="font-sans text-caption text-haunt-mute">Loading map</Text>
        </View>
      )}
      <Text className="mt-3 font-sans text-caption text-haunt-mute">Drag the pin. The circle is where a visit counts.</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen((current) => !current)}
        className="mt-2 h-11 justify-center">
        <Text className="font-sans-semibold text-body text-haunt-accent">Enter coordinates</Text>
      </Pressable>
      {open ? (
        <View className="mt-2 gap-4">
          <TextField
            label="Latitude"
            value={latText}
            keyboardType="numbers-and-punctuation"
            onChangeText={(text) => {
              setLatText(text);
              const next = parseCoord(text);
              if (next !== null && next >= -90 && next <= 90) onChange({ lat: next, lng });
            }}
            onBlur={() => setLatText(String(lat))}
          />
          <TextField
            label="Longitude"
            value={lngText}
            keyboardType="numbers-and-punctuation"
            onChangeText={(text) => {
              setLngText(text);
              const next = parseCoord(text);
              if (next !== null && next >= -180 && next <= 180) onChange({ lat, lng: next });
            }}
            onBlur={() => setLngText(String(lng))}
          />
        </View>
      ) : null}
    </View>
  );
}
