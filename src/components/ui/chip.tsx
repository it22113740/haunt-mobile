import { PressScale } from '@/components/ui/press-scale';
import { useHuntTheme } from '@/theme/colors';
import type { LucideIcon } from 'lucide-react-native';
import { Text } from 'react-native';

type ChipProps = {
  label: string;
  selected?: boolean;
  /** Omit for a static, non-interactive chip. */
  onPress?: () => void;
  icon?: LucideIcon;
  compact?: boolean;
  /** Ink outline for an action chip (e.g. "Turn on" on the map card). */
  strong?: boolean;
  accessibilityLabel?: string;
};

export function Chip({
  label,
  selected,
  onPress,
  icon: Icon,
  compact = false,
  strong = false,
  accessibilityLabel,
}: ChipProps) {
  const { colors } = useHuntTheme();
  const fg = selected ? colors.paper : colors.ink;
  return (
    <PressScale
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: Boolean(selected) }}
      disabled={!onPress}
      hitSlop={compact ? 6 : 4}
      onPress={onPress}
      style={{
        height: compact ? 32 : 34,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected || strong ? colors.ink : colors.lineStrong,
        backgroundColor: selected ? colors.ink : 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}>
      {Icon ? <Icon color={fg} size={15} strokeWidth={1.9} /> : null}
      <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: fg }}>{label}</Text>
    </PressScale>
  );
}
