import { Illustration } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { useHauntColors } from '@/theme/colors';
import { Check } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const checks = ['Add your place', 'Create a perk', 'Start reviewing'];

const bits = [
  { x: -90, y: -30, delay: 0, color: 'accent' },
  { x: 80, y: -50, delay: 40, color: 'gold' },
  { x: -40, y: -80, delay: 80, color: 'accent' },
  { x: 50, y: -20, delay: 20, color: 'gold' },
  { x: -70, y: 20, delay: 60, color: 'gold' },
  { x: 100, y: 10, delay: 100, color: 'accent' },
] as const;

export function SetupWelcome({
  done,
  onStart,
}: {
  done: boolean[];
  onStart: () => void;
}) {
  const colors = useHauntColors();
  return (
    <View className="flex-1 px-6">
      <Illustration name="onb-owner" size={200} />
      <Text className="mt-6 font-display text-display-lg text-haunt-ink">Let’s set up your venue</Text>
      <Text className="mt-2 font-sans text-body text-haunt-mute">Three steps, then guests can start earning.</Text>
      <View className="mt-8 gap-3">
        {checks.map((label, index) => (
          <View key={label} className="flex-row items-center rounded-3xl bg-haunt-card px-4 py-4">
            <View className={`h-8 w-8 items-center justify-center rounded-full ${done[index] ? 'bg-haunt-goodSoft' : 'bg-haunt-blush'}`}>
              {done[index] ? <Check color={colors.good} size={16} /> : <Text className="font-sans-semibold text-caption text-haunt-accent">{index + 1}</Text>}
            </View>
            <Text className="ml-3 font-sans-semibold text-body text-haunt-ink">{label}</Text>
          </View>
        ))}
      </View>
      <View className="mt-auto pb-6">
        <Button label="Get started" onPress={onStart} />
      </View>
    </View>
  );
}

export function SetupFinish({ onDone, loading }: { onDone: () => void; loading?: boolean }) {
  const colors = useHauntColors();
  const scale = useSharedValue(0.86);
  const fade = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ opacity: fade.value, transform: [{ scale: scale.value }] }));

  useEffect(() => {
    scale.value = withTiming(1, { duration: 360 });
    fade.value = withTiming(1, { duration: 360 });
  }, [fade, scale]);

  return (
    <View className="flex-1 items-center justify-center px-6">
      {bits.map((bit) => (
        <ConfettiBit key={`${bit.x}-${bit.y}`} x={bit.x} y={bit.y} delay={bit.delay} color={bit.color === 'gold' ? colors.gold : colors.accent} />
      ))}
      <Animated.View style={style} className="items-center">
        <Illustration name="onb-owner" size={200} />
        <Text className="mt-6 text-center font-display text-display-lg text-haunt-ink">You’re ready</Text>
        <Text className="mt-2 text-center font-sans text-body text-haunt-mute">Guests can find your place and start earning.</Text>
      </Animated.View>
      <View className="absolute bottom-6 left-6 right-6">
        <Button label="Open your places" onPress={onDone} loading={loading} />
      </View>
    </View>
  );
}

function ConfettiBit({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  const rise = useSharedValue(12);
  const opacity = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x }, { translateY: y + rise.value }],
  }));

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 220 }));
    rise.value = withDelay(delay, withTiming(0, { duration: 420 }));
  }, [delay, opacity, rise]);

  return <Animated.View style={[{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: color }, style]} />;
}
