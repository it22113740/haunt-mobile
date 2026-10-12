import { PressScale } from '@/components/ui/press-scale';
import { useSurfaces } from '@/theme/surfaces';
import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

type CardTone = 'card' | 'soft' | 'raised' | 'selected';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  tone?: CardTone;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Card({ children, onPress, className, tone = 'card', style, accessibilityLabel }: CardProps) {
  const { surfaces } = useSurfaces();
  const clip: ViewStyle | null = tone === 'card' || tone === 'soft' ? { overflow: 'hidden' } : null;
  const frame = [surfaces[tone], clip, style];
  if (!onPress) {
    return (
      <View className={className} style={frame}>
        {children}
      </View>
    );
  }

  return (
    <PressableCard className={className} style={frame} onPress={onPress} accessibilityLabel={accessibilityLabel}>
      {children}
    </PressableCard>
  );
}

function PressableCard({
  children,
  onPress,
  className,
  style,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress: () => void;
  className?: string;
  style: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={style}
      className={className}>
      {children}
    </PressScale>
  );
}
