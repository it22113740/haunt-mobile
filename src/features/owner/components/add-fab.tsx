import { AnimatedPressable } from '@/components/ui/animated';
import { usePressScale } from '@/components/ui/press';
import { useHauntColors } from '@/theme/colors';
import { Plus } from 'lucide-react-native';

export function AddFab({ onPress, bottom }: { onPress: () => void; bottom: number }) {
  const colors = useHauntColors();
  const press = usePressScale();

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel="Add"
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[press.style, { position: 'absolute', right: 24, bottom }]}
      className="h-14 w-14 items-center justify-center rounded-full bg-haunt-accent shadow-card">
      <Plus color={colors.onAccent} size={26} />
    </AnimatedPressable>
  );
}
