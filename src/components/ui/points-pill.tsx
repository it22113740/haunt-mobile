import { useHauntColors } from '@/theme/colors';
import { Sparkles } from 'lucide-react-native';
import { Text, View } from 'react-native';

export function PointsPill({ value }: { value: number | string }) {
  const colors = useHauntColors();
  return (
    <View className="flex-row items-center gap-1 self-start rounded-full bg-haunt-gold/15 px-3 py-1">
      <Sparkles color={colors.gold} size={14} />
      <Text className="font-display text-caption text-haunt-ink">{value}</Text>
    </View>
  );
}
