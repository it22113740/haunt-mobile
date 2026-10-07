import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export function ScreenEnter({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View entering={FadeIn.duration(320)} className={className} style={[{ flex: 1 }, style]}>
      {children}
    </Animated.View>
  );
}

export function ListEnter({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 12) * 40).duration(360)} className={className}>
      {children}
    </Animated.View>
  );
}
