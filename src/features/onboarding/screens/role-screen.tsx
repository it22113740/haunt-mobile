import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { useLaunchFlags } from '@/lib/launch-flags';
import { useHauntColors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { Compass, Store, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Role = 'USER' | 'OWNER';

const choices: { role: Role; title: string; detail: string; icon: LucideIcon }[] = [
  { role: 'USER', title: "I'm here to explore", detail: 'Find places, post visits, and spend points.', icon: Compass },
  { role: 'OWNER', title: 'I own a venue', detail: 'Publish perks and approve guest visits.', icon: Store },
];

export function RoleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useHauntColors();
  const completeOnboarding = useLaunchFlags((state) => state.completeOnboarding);
  const [role, setRole] = useState<Role>('USER');
  const [busy, setBusy] = useState(false);

  const finish = async (next: 'register' | 'login') => {
    setBusy(true);
    await completeOnboarding();
    if (next === 'login') {
      router.replace('/(auth)/login');
      return;
    }
    router.replace({ pathname: '/(auth)/register', params: { role } });
  };

  return (
    <ScreenEnter
      className="flex-1 justify-between bg-haunt-paper px-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 16) }}>
      <View>
        <Text className="font-display text-display-lg text-haunt-ink">How will you use Haunt?</Text>
        <Text className="mt-3 font-sans text-body text-haunt-mute">You can switch later by creating the other kind of account.</Text>
        <View className="mt-8 gap-4">
          {choices.map((choice, index) => {
            const selected = role === choice.role;
            const Icon = choice.icon;
            return (
              <ListEnter key={choice.role} index={index}>
              <Card
                onPress={() => setRole(choice.role)}
                className={`border-2 p-5 ${selected ? 'border-haunt-ink' : 'border-transparent'}`}>
                <View className="flex-row items-center">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-haunt-blush">
                    <Icon color={colors.accent} size={22} />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="font-display text-title text-haunt-ink">{choice.title}</Text>
                    <Text className="mt-1 font-sans text-caption text-haunt-mute">{choice.detail}</Text>
                  </View>
                </View>
              </Card>
              </ListEnter>
            );
          })}
        </View>
      </View>
      <View>
        <Button label="Continue" onPress={() => void finish('register')} loading={busy} />
        <Pressable accessibilityRole="button" onPress={() => void finish('login')} className="mt-2 h-14 items-center justify-center">
          <Text className="font-sans-semibold text-body text-haunt-ink">I already have an account</Text>
        </Pressable>
      </View>
    </ScreenEnter>
  );
}
