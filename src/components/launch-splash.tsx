import { MotionView } from '@/components/ui/animated';
import { useHuntColors, useHuntVariant } from '@/theme/colors';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const wordmarks = {
  white: require('../../assets/images/splash-icon.png'),
  journal: require('../../assets/images/splash-icon-dark.png'),
};

/** Same artwork, size and position as the native splash so the hand-off is invisible. */
const MARK_SIZE = 240;
const MIN_VISIBLE_MS = 800;

/**
 * In-app continuation of the native splash. It also covers Expo Go, which never shows the native one.
 * Stays up until `ready`, then fades into the app.
 */
export function LaunchSplash({ ready }: { ready: boolean }) {
  const colors = useHuntColors();
  const variant = useHuntVariant();
  const reduceMotion = useReducedMotion();
  const [held, setHeld] = useState(false);
  const [gone, setGone] = useState(Platform.OS === 'web');
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const fade = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  const lift = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  useEffect(() => {
    const timer = setTimeout(() => setHeld(true), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || !held || gone) return;
    const duration = reduceMotion ? 120 : 320;
    if (!reduceMotion) scale.set(withTiming(1.06, { duration }));
    opacity.set(
      withDelay(
        60,
        withTiming(0, { duration }, (finished) => {
          if (finished) runOnJS(setGone)(true);
        }),
      ),
    );
  }, [gone, held, opacity, ready, reduceMotion, scale]);

  if (gone) return null;

  return (
    <MotionView
      pointerEvents={ready && held ? 'none' : 'auto'}
      accessible
      accessibilityLabel="Hunt"
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
        fade,
      ]}>
      <MotionView style={lift}>
        <Image source={wordmarks[variant]} style={{ width: MARK_SIZE, height: MARK_SIZE }} resizeMode="contain" />
      </MotionView>
    </MotionView>
  );
}
