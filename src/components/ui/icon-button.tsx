import { PressScale } from '@/components/ui/press-scale';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { ArrowLeft, type LucideIcon } from 'lucide-react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  color?: string;
  size?: number;
  /** Orange disc (e.g. the "change photo" button on the profile avatar). */
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ icon: Icon, label, onPress, color, size = 44, filled = false, style }: IconButtonProps) {
  const { colors, surfaces } = useSurfaces();

  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={size < 44 ? (44 - size) / 2 : 0}
      onPress={onPress}
      style={[
        surfaces.iconButton,
        { width: size, height: size, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
        filled ? { backgroundColor: colors.accent } : null,
        style,
      ]}>
      <Icon color={color ?? (filled ? colors.onAccent : colors.ink)} size={Math.round(size * 0.44)} strokeWidth={1.9} />
    </PressScale>
  );
}

export function BackButton({ onPress }: { onPress?: () => void }) {
  const router = useRouter();
  return <IconButton icon={ArrowLeft} label="Go back" onPress={onPress ?? (() => router.back())} />;
}
