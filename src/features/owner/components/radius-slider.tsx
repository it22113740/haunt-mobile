import { Label, Mono } from '@/components/ui/typography';
import { useSurfaces } from '@/theme/surfaces';
import { useState } from 'react';
import { Text, View } from 'react-native';

type RadiusSliderProps = {
  value: number;
  onChange: (meters: number) => void;
};

const MIN = 10;
const STEP = 10;
const KNOB = 24;

export function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  const { colors, isJournal } = useSurfaces();
  const max = Math.max(500, value);
  const [width, setWidth] = useState(1);
  const ratio = Math.min(1, Math.max(0, (value - MIN) / (max - MIN)));
  const meters = Math.round(value);

  const setFromX = (x: number) => {
    const next = MIN + Math.min(1, Math.max(0, x / width)) * (max - MIN);
    onChange(Math.max(MIN, Math.round(next / STEP) * STEP));
  };

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Label>Check-in circle</Label>
        <Text>
          <Text
            style={{ fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 28, letterSpacing: -0.84, color: colors.ink }}>
            {meters}
          </Text>
          <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 13, color: colors.mute }}> m</Text>
        </Text>
      </View>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Check-in circle"
        accessibilityValue={{ min: MIN, max, now: meters, text: `${meters} meters` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') onChange(Math.min(max, meters + STEP));
          if (event.nativeEvent.actionName === 'decrement') onChange(Math.max(MIN, meters - STEP));
        }}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(event) => setFromX(event.nativeEvent.locationX)}
        onResponderMove={(event) => setFromX(event.nativeEvent.locationX)}
        style={{ height: 40, justifyContent: 'center' }}>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.lineStrong }} pointerEvents="none">
          <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.accent, width: `${ratio * 100}%` }} />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: Math.max(0, Math.min(width - KNOB, ratio * width - KNOB / 2)),
            width: KNOB,
            height: KNOB,
            borderRadius: KNOB / 2,
            backgroundColor: colors.accent,
            borderWidth: isJournal ? 1.5 : 2,
            borderColor: isJournal ? colors.ink : colors.card,
            boxShadow: isJournal ? `0px 2px 0px ${colors.ink}` : '0px 2px 8px rgba(24,24,26,0.25)',
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Mono size={11} color={colors.faint}>{`${MIN} m · a café`}</Mono>
        <Mono size={11} color={colors.faint}>{`${max} m · a park`}</Mono>
      </View>
    </View>
  );
}
