import { hapticLight } from '@/components/ui/press';
import { useHauntColors } from '@/theme/colors';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: LucideIcon;
};

export function Chip({ label, selected, onPress, icon: Icon }: ChipProps) {
  const colors = useHauntColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      onPress={() => {
        hapticLight();
        onPress();
      }}
      className={`h-10 flex-row items-center gap-2 rounded-full px-4 ${selected ? 'bg-haunt-ink' : 'bg-haunt-card'}`}>
      {Icon ? <Icon color={selected ? colors.card : colors.ink} size={16} /> : null}
      <Text className={`font-sans-semibold text-caption ${selected ? 'text-haunt-card' : 'text-haunt-ink'}`}>{label}</Text>
    </Pressable>
  );
}
