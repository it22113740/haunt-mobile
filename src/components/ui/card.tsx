import { AnimatedPressable } from '@/components/ui/animated';
import { usePressScale } from '@/components/ui/press';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
};

export function Card({ children, onPress, className }: CardProps) {
  const frame = `overflow-hidden rounded-3xl bg-haunt-card shadow-card ${className ?? ''}`;
  if (!onPress) {
    return (
      <View className={frame} style={{ elevation: 4 }}>
        {children}
      </View>
    );
  }

  return <PressableCard className={frame} onPress={onPress}>{children}</PressableCard>;
}

function PressableCard({ children, onPress, className }: { children: ReactNode; onPress: () => void; className: string }) {
  const press = usePressScale();
  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[press.style, { elevation: 4 }]}
      className={className}>
      {children}
    </AnimatedPressable>
  );
}
