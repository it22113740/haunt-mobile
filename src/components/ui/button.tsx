import { AnimatedPressable } from '@/components/ui/animated';
import { usePressScale } from '@/components/ui/press';
import { useHauntColors } from '@/theme/colors';
import type { ReactNode } from 'react';
import { ActivityIndicator, Text } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'lg' | 'md' | 'sm';
  leftIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

const heights = { lg: 'h-14', md: 'h-12', sm: 'h-10' };
const surfaces = {
  primary: 'bg-haunt-accent',
  secondary: 'bg-haunt-blush',
  ghost: 'bg-transparent',
  danger: 'bg-haunt-danger',
};
const labels = {
  primary: 'text-haunt-onAccent',
  secondary: 'text-haunt-accent',
  ghost: 'text-haunt-ink',
  danger: 'text-haunt-paper',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  leftIcon,
  loading,
  disabled,
  className,
}: ButtonProps) {
  const colors = useHauntColors();
  const inactive = Boolean(loading || disabled);
  const press = usePressScale(!inactive);
  const spinner = variant === 'secondary' || variant === 'ghost' ? colors.accent : variant === 'danger' ? colors.paper : colors.onAccent;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={press.style}
      className={`flex-row items-center justify-center gap-2 rounded-2xl px-4 ${heights[size]} ${surfaces[variant]} ${inactive ? 'opacity-60' : ''} ${className ?? ''}`}>
      {loading ? <ActivityIndicator color={spinner} /> : leftIcon}
      {loading ? null : (
        <Text className={`font-sans-semibold text-body ${labels[variant]}`}>{label}</Text>
      )}
    </AnimatedPressable>
  );
}
