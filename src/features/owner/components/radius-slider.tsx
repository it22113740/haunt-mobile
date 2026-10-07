import { useState } from 'react';
import { Text, View } from 'react-native';

type RadiusSliderProps = {
  value: number;
  onChange: (meters: number) => void;
};

const MIN = 10;

export function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  const max = Math.max(500, value);
  const [width, setWidth] = useState(1);
  const ratio = Math.min(1, Math.max(0, (value - MIN) / (max - MIN)));

  const setFromX = (x: number) => {
    const next = MIN + Math.min(1, Math.max(0, x / width)) * (max - MIN);
    onChange(Math.max(MIN, Math.round(next / 10) * 10));
  };

  return (
    <View>
      <Text className="font-display-extra text-display-lg text-haunt-ink">{Math.round(value)}</Text>
      <Text className="mt-1 text-sm text-haunt-mute">meter check-in radius</Text>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel="Check-in radius"
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event) => setFromX(event.nativeEvent.locationX)}
        onResponderMove={(event) => setFromX(event.nativeEvent.locationX)}
        className="mt-4 h-11 justify-center">
        <View className="h-2 rounded-full bg-haunt-blush">
          <View className="h-2 rounded-full bg-haunt-accent" style={{ width: `${ratio * 100}%` }} />
        </View>
        <View
          className="absolute h-6 w-6 rounded-full border-2 border-haunt-card bg-haunt-accent"
          style={{ left: Math.max(0, ratio * width - 12) }}
        />
      </View>
    </View>
  );
}
