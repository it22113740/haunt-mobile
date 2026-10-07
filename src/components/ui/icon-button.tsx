import { AnimatedPressable } from '@/components/ui/animated';
import { usePressScale } from '@/components/ui/press';
import { useHauntColors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { ArrowLeft, type LucideIcon } from 'lucide-react-native';

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  color?: string;
};

export function IconButton({ icon: Icon, label, onPress, color }: IconButtonProps) {
  const colors = useHauntColors();
  const press = usePressScale();

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[press.style, { elevation: 4 }]}
      className="h-11 w-11 items-center justify-center rounded-full bg-haunt-card shadow-card">
      <Icon color={color ?? colors.ink} size={20} />
    </AnimatedPressable>
  );
}

export function BackButton({ onPress }: { onPress?: () => void }) {
  const router = useRouter();
  return <IconButton icon={ArrowLeft} label="Go back" onPress={onPress ?? (() => router.back())} />;
}
