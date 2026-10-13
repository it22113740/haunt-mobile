import { PressScale } from '@/components/ui/press-scale';
import { useHuntTheme } from '@/theme/colors';
import type { ReactNode } from 'react';
import { ActivityIndicator, Text, type ViewStyle } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'lg' | 'md' | 'sm';
  leftIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  accessibilityHint?: string;
};

const heights = { lg: 52, md: 48, sm: 40 };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  leftIcon,
  loading,
  disabled,
  className,
  accessibilityHint,
}: ButtonProps) {
  const { colors, isJournal } = useHuntTheme();
  const inactive = Boolean(loading || disabled);
  const off = Boolean(disabled && !loading) && variant !== 'ghost';
  const shadowOffset = size === 'sm' ? 2 : 3;

  const frame: ViewStyle = {
    height: heights[size],
    borderRadius: 10,
    paddingHorizontal: size === 'sm' ? 22 : 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  let surface: ViewStyle;
  let textColor: string;
  if (off) {
    surface = { backgroundColor: 'transparent', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.lineStrong };
    textColor = colors.faint;
  } else if (variant === 'primary') {
    surface = {
      backgroundColor: colors.accent,
      borderWidth: 1.5,
      borderColor: isJournal ? colors.ink : colors.accent,
      ...(isJournal ? { boxShadow: `0px ${shadowOffset}px 0px ${colors.ink}` } : null),
    };
    textColor = colors.onAccent;
  } else if (variant === 'secondary') {
    surface = {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: isJournal ? colors.ink : colors.lineStrong,
      ...(isJournal && size === 'sm' ? { boxShadow: `0px 2px 0px ${colors.ink}` } : null),
    };
    textColor = colors.ink;
  } else if (variant === 'danger') {
    surface = {
      backgroundColor: colors.danger,
      borderWidth: 1.5,
      borderColor: isJournal ? colors.ink : colors.danger,
      ...(isJournal ? { boxShadow: `0px ${shadowOffset}px 0px ${colors.ink}` } : null),
    };
    textColor = colors.card;
  } else {
    surface = { backgroundColor: 'transparent' };
    textColor = colors.ink;
  }
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: Boolean(loading) }}
      disabled={inactive}
      onPress={onPress}
      style={[frame, surface, loading ? { opacity: 0.85 } : null]}
      className={className}>
      {loading ? <ActivityIndicator color={textColor} /> : off ? null : leftIcon}
      {loading ? null : (
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'BricolageGrotesque_700Bold',
            fontSize: size === 'sm' ? 14 : 16,
            color: textColor,
          }}>
          {label}
        </Text>
      )}
    </PressScale>
  );
}
