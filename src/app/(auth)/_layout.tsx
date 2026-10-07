import { useHauntColors } from '@/theme/colors';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const colors = useHauntColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    />
  );
}
