import { TextField } from '@/features/auth/components/text-field';
import { useHauntColors } from '@/theme/colors';
import { useState } from 'react';
import { Text, View } from 'react-native';

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
  const [latText, setLatText] = useState(String(lat));
  const [lngText, setLngText] = useState(String(lng));
  const size = 56 + ((Math.min(radiusMeters, 500) - 10) / 490) * 120;
  const colors = useHauntColors();

  return (
    <View>
      <View className="mb-4 h-40 items-center justify-center rounded-3xl bg-haunt-blush">
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: colors.accent,
            backgroundColor: `${colors.accent}29`,
          }}
        />
      </View>
      <Text className="mb-4 text-sm text-haunt-mute">
        Set the pin with latitude and longitude. The circle is the check-in area.
      </Text>
      <View className="gap-4">
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
    </View>
  );
}
