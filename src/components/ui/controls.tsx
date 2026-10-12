import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { MotionView } from '@/components/ui/animated';
import { PressScale } from '@/components/ui/press-scale';
import { hapticLight } from '@/components/ui/press';
import { useHauntTheme } from '@/theme/colors';

const TRACK_W = 52;
const KNOB = 23;
const TRAVEL = TRACK_W - 1.5 * 2 - 2 * 2 - KNOB;

export function Toggle({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  accessibilityLabel: string;
}) {
  const { colors } = useHauntTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.set(withTiming(value ? 1 : 0, { duration: 180 }));
  }, [progress, value]);

  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: progress.value * TRAVEL }] }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => {
        hapticLight();
        onValueChange(!value);
      }}
      style={{
        width: TRACK_W,
        height: 30,
        borderRadius: 99,
        borderWidth: 1.5,
        borderColor: colors.ink,
        padding: 2,
        justifyContent: 'center',
        backgroundColor: value ? colors.accent : colors.card,
        opacity: disabled ? 0.5 : 1,
      }}>
      <MotionView
        style={[
          { width: KNOB, height: KNOB, borderRadius: 99, backgroundColor: value ? colors.ink : colors.ruled },
          knobStyle,
        ]}
      />
    </Pressable>
  );
}

export type SegmentOption<T extends string> = { value: T; label: string; count?: number };

/** Underlined text tabs (`.seg`). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  const { colors } = useHauntTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={{ flexDirection: 'row', gap: 20, borderBottomWidth: 1, borderBottomColor: colors.line }}>
      {options.map((option) => {
        const on = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              if (on) return;
              hapticLight();
              onChange(option.value);
            }}
            style={{
              paddingVertical: 10,
              marginBottom: -1,
              borderBottomWidth: 2,
              borderBottomColor: on ? colors.accent : 'transparent',
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: 6,
            }}>
            <Text
              style={{
                fontFamily: 'BricolageGrotesque_600SemiBold',
                fontSize: 15,
                color: on ? colors.ink : colors.mute,
              }}>
              {option.label}
            </Text>
            {option.count !== undefined ? (
              <Text
                style={{
                  fontFamily: 'IBMPlexMono_400Regular',
                  fontSize: 13,
                  color: on ? colors.accentDeep : colors.faint,
                }}>
                {option.count}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export type StatItem = {
  key: string;
  value: number | string;
  label: string;
  accent?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Three-column mono stats strip ruled top and bottom. */
export function StatStrip({ items }: { items: StatItem[] }) {
  const { colors, isJournal } = useHauntTheme();
  const rule = isJournal ? { width: 1.5, color: colors.ink } : { width: 1, color: colors.line };
  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: rule.width,
        borderBottomWidth: rule.width,
        borderColor: rule.color,
      }}>
      {items.map((item, index) => {
        const content = (
          <>
            <Text
              style={{
                fontFamily: 'IBMPlexMono_500Medium',
                fontSize: 22,
                color: item.accent ? colors.accentDeep : colors.ink,
              }}>
              {item.value}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'IBMPlexMono_400Regular',
                fontSize: 11,
                letterSpacing: 0.22,
                textTransform: 'uppercase',
                color: colors.mute,
              }}>
              {item.label}
            </Text>
          </>
        );
        const cellStyle = {
          flex: 1,
          gap: 2,
          paddingVertical: 10,
          paddingLeft: index === 0 ? 0 : 12,
          borderLeftWidth: index === 0 ? 0 : 1,
          borderLeftColor: colors.line,
        } as const;
        return item.onPress ? (
          <PressScale
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel ?? `${item.value} ${item.label}`}
            onPress={item.onPress}
            style={cellStyle}>
            {content}
          </PressScale>
        ) : (
          <View
            key={item.key}
            accessible
            accessibilityLabel={item.accessibilityLabel ?? `${item.value} ${item.label}`}
            style={cellStyle}>
            {content}
          </View>
        );
      })}
    </View>
  );
}
