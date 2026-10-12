import { MotionView } from '@/components/ui/animated';
import { Illustration } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { Body, H1, Hand, Label, MarkedHeading, Sub } from '@/components/ui/typography';
import { useSurfaces } from '@/theme/surfaces';
import { Check } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const checks = ['Add your place', 'Create a perk', 'Start reviewing'];

const bits = [
  { x: -90, y: -30, delay: 0, accent: true },
  { x: 80, y: -50, delay: 40, accent: false },
  { x: -40, y: -80, delay: 80, accent: true },
  { x: 50, y: -20, delay: 20, accent: false },
  { x: -70, y: 20, delay: 60, accent: false },
  { x: 100, y: 10, delay: 100, accent: true },
] as const;

export function SetupWelcome({ done, onStart }: { done: boolean[]; onStart: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors, surfaces } = useSurfaces();
  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 14) + 10 }}>
      <View style={{ alignItems: 'center' }}>
        <Illustration name="onb-owner" size={210} />
      </View>
      <View style={{ gap: 8, marginTop: 8 }}>
        <Label>For business</Label>
        <MarkedHeading before="Let’s set up " mark="your place" />
        <Sub>Three steps, then guests can start earning.</Sub>
      </View>
      <View style={{ marginTop: 26 }}>
        {checks.map((label, index) => (
          <View
            key={label}
            accessible
            accessibilityLabel={`${label}${done[index] ? ', done' : ''}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
            }}>
            <View
              style={[
                surfaces.avatar,
                {
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                done[index] ? { backgroundColor: colors.goodSoft, borderColor: colors.good } : null,
              ]}>
              {done[index] ? (
                <Check color={colors.good} size={16} strokeWidth={2.4} />
              ) : (
                <Text style={{ fontFamily: 'IBMPlexMono_500Medium', fontSize: 13, color: colors.accentDeep }}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              )}
            </View>
            <Body size={16} weight="bold" style={{ flex: 1 }}>
              {label}
            </Body>
          </View>
        ))}
      </View>
      <Hand style={{ marginTop: 16 }}>takes about five minutes</Hand>
      <View style={{ marginTop: 'auto' }}>
        <Button label="Get started" onPress={onStart} />
      </View>
    </View>
  );
}

export function SetupFinish({ onDone, loading }: { onDone: () => void; loading?: boolean }) {
  const insets = useSafeAreaInsets();
  const { colors } = useSurfaces();
  const scale = useSharedValue(0.86);
  const fade = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ opacity: fade.value, transform: [{ scale: scale.value }] }));

  useEffect(() => {
    scale.set(withTiming(1, { duration: 360 }));
    fade.set(withTiming(1, { duration: 360 }));
  }, [fade, scale]);

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 14) + 10 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {bits.map((bit) => (
          <ConfettiBit
            key={`${bit.x}-${bit.y}`}
            x={bit.x}
            y={bit.y}
            delay={bit.delay}
            color={bit.accent ? colors.accent : colors.accentDeep}
          />
        ))}
        <MotionView style={[style, { alignItems: 'center', gap: 10 }]}>
          <Illustration name="success-sent" size={210} />
          <H1 style={{ textAlign: 'center' }}>You’re ready</H1>
          <Sub style={{ textAlign: 'center', maxWidth: 280 }}>Guests can find your place and start earning.</Sub>
          <Hand style={{ marginTop: 4, transform: [{ rotate: '-2deg' }] }}>first visit’s on its way</Hand>
        </MotionView>
      </View>
      <Button label="Open your places" onPress={onDone} loading={loading} />
    </View>
  );
}

function ConfettiBit({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  const rise = useSharedValue(12);
  const opacity = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x }, { translateY: y + rise.value }, { rotate: '45deg' }],
  }));

  useEffect(() => {
    opacity.set(withDelay(delay, withTiming(1, { duration: 220 })));
    rise.set(withDelay(delay, withTiming(0, { duration: 420 })));
  }, [delay, opacity, rise]);

  return <MotionView style={[{ position: 'absolute', width: 9, height: 9, backgroundColor: color }, style]} />;
}
