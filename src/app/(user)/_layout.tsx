import { useHauntColors } from '@/theme/colors';
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function UserLayout() {
  const colors = useHauntColors();

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="location" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="venue/[id]" />
    </Stack>
  );
}
