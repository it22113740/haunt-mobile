import { useHuntColors } from '@/theme/colors';
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function OwnerLayout() {
  const colors = useHuntColors();

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="venue/new" />
      <Stack.Screen name="venue/[id]" />
      <Stack.Screen name="perk/new" />
      <Stack.Screen name="perk/[id]" />
      <Stack.Screen name="promotion/new" />
      <Stack.Screen name="promotion/[id]" />
    </Stack>
  );
}
