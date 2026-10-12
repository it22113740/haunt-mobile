import { MotionView } from '@/components/ui/animated';
import { Button } from '@/components/ui/button';
import { Doodle } from '@/components/ui/decor';
import { ScreenEnter } from '@/components/ui/enter';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { H1, Hand, Sub } from '@/components/ui/typography';
import { useHuntColors } from '@/theme/colors';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type CaptureSuccessProps = {
  points: number;
  onActivity: () => void;
  onAgain: () => void;
};

export function CaptureSuccess({ points, onActivity, onAgain }: CaptureSuccessProps) {
  const colors = useHuntColors();
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const scale = useSharedValue(0.86);
  const opacity = useSharedValue(0);
  const art = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));

  useEffect(() => {
    scale.set(withTiming(1, { duration: 360 }));
    opacity.set(withTiming(1, { duration: 360 }));
  }, [opacity, scale]);

  return (
    <ScreenEnter
      className="flex-1 bg-hunt-paper"
      style={{ paddingTop: insets.top + 22, paddingBottom: tabInset, paddingHorizontal: 20 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <MotionView style={[{ width: 140, height: 110, alignItems: 'center', justifyContent: 'center' }, art]}>
          <Doodle kind="sparkle" size={20} accent style={{ left: 6, top: 4 }} />
          <Doodle kind="sparkle" size={11} style={{ left: 0, top: 44 }} />
          <Doodle kind="star" size={16} accent rotate={10} style={{ right: 4, top: 60 }} />
          <Svg width={76} height={76} viewBox="0 0 76 76" accessibilityLabel="Sent">
            <Path
              d="M38 6c18 0 32 14 32 32S56 70 38 70 6 56 6 38 20 6 38 6z"
              fill="none"
              stroke={colors.ink}
              strokeWidth={1.8}
            />
            <Path
              d="M24 39l10 10 19-22"
              fill="none"
              stroke={colors.accent}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </MotionView>
        <H1 style={{ textAlign: 'center' }}>Sent for review</H1>
        <Sub style={{ textAlign: 'center', maxWidth: 300 }}>
          {points > 0
            ? `You’ll earn up to +${points} points once the place approves your shots.`
            : 'The place will look at your shots soon.'}
        </Sub>
        <Hand>fingers crossed</Hand>
        <View style={{ height: 70, alignSelf: 'stretch' }}>
          <Doodle kind="squiggle" size={110} style={{ left: '30%', top: 20 }} />
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <Button label="See it in your log" onPress={onActivity} />
        <Button label="Capture another" variant="secondary" onPress={onAgain} />
      </View>
    </ScreenEnter>
  );
}
