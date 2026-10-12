import { MotionView } from '@/components/ui/animated';
import { useSurfaces } from '@/theme/surfaces';
import type { AnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ViewStyle } from 'react-native';

/** Paper strip behind the status bar so scrolled content never runs under the clock and icons. */
export function StatusBarScrim({ style }: { style?: AnimatedStyle<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  const { colors } = useSurfaces();
  if (!insets.top) return null;
  return (
    <MotionView
      pointerEvents="none"
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.paper, zIndex: 10 },
        style,
      ]}
    />
  );
}
