import { useHuntColors } from '@/theme/colors';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  const colors = useHuntColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    />
  );
}
