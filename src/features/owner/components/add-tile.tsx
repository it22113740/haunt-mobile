import { PressScale } from '@/components/ui/press-scale';
import { useSurfaces } from '@/theme/surfaces';
import { Plus } from 'lucide-react-native';
import { Text, type StyleProp, type ViewStyle } from 'react-native';

/** Dashed "+ Add …" row that closes owner lists. */
export function AddTile({
  label,
  onPress,
  height = 60,
  style,
}: {
  label: string;
  onPress: () => void;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, surfaces } = useSurfaces();

  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        surfaces.dashed,
        { height, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
        style,
      ]}>
      <Plus color={colors.ink} size={18} strokeWidth={2} />
      <Text style={{ fontFamily: 'BricolageGrotesque_700Bold', fontSize: 15, color: colors.ink }}>{label}</Text>
    </PressScale>
  );
}
