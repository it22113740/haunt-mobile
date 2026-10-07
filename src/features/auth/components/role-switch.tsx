import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Role = 'USER' | 'OWNER';

type RoleSwitchProps = {
  value: Role;
  onChange: (role: Role) => void;
};

const options: { role: Role; label: string }[] = [
  { role: 'USER', label: 'Member' },
  { role: 'OWNER', label: 'Owner' },
];

export function RoleSwitch({ value, onChange }: RoleSwitchProps) {
  const [width, setWidth] = useState(0);
  const offset = useSharedValue(0);
  const segment = Math.max(0, (width - 8) / 2);

  useEffect(() => {
    offset.value = withTiming(value === 'OWNER' ? segment : 0, { duration: 220 });
  }, [offset, segment, value]);

  const indicator = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      className="flex-row rounded-2xl bg-haunt-blush p-1">
      {segment > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', top: 4, bottom: 4, left: 4, width: segment }, indicator]}
          className="rounded-xl bg-haunt-card shadow-card"
        />
      ) : null}
      {options.map((option) => {
        const selected = value === option.role;
        return (
          <Pressable
            key={option.role}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.role)}
            className="h-11 flex-1 items-center justify-center rounded-xl">
            <Text className={`font-sans-semibold text-caption ${selected ? 'text-haunt-ink' : 'text-haunt-mute'}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
