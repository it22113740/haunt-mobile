import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Doodle } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { Body, Hand, Label, MarkedHeading, Sub } from '@/components/ui/typography';
import { useLaunchFlags } from '@/lib/launch-flags';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { Check, Compass, Store, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Role = 'USER' | 'OWNER';

const choices: { role: Role; tag: string; title: string; detail: string; icon: LucideIcon }[] = [
  {
    role: 'USER',
    tag: 'Explorer',
    title: 'I’m here to explore',
    detail: 'Find places, post visits, and spend points.',
    icon: Compass,
  },
  {
    role: 'OWNER',
    tag: 'Business',
    title: 'I own a venue',
    detail: 'Publish perks and approve guest visits.',
    icon: Store,
  },
];

export function RoleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, surfaces } = useSurfaces();
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
      className="flex-1 bg-haunt-paper"
      style={{
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: insets.top + 28,
        paddingBottom: Math.max(insets.bottom, 14) + 10,
      }}>
      <View>
        <Doodle kind="sparkle" size={18} accent style={{ right: 6, top: 0 }} />
        <Doodle kind="sparkle" size={10} style={{ right: 30, top: 24 }} />
        <View style={{ gap: 10 }}>
          <Label>Welcome</Label>
          <MarkedHeading before="How will you use " mark="Haunt" after="?" />
          <Sub>You can switch later by creating the other kind of account.</Sub>
        </View>
        <View accessibilityRole="radiogroup" style={{ marginTop: 28, gap: 14 }}>
          {choices.map((choice, index) => {
            const selected = role === choice.role;
            const Icon = choice.icon;
            return (
              <ListEnter key={choice.role} index={index}>
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${choice.title}. ${choice.detail}`}
                  onPress={() => setRole(choice.role)}>
                  <Card tone={selected ? 'selected' : 'soft'} style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                      <View
                        style={[
                          surfaces.avatar,
                          { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
                        ]}>
                        <Icon color={colors.ink} size={22} strokeWidth={1.8} />
                      </View>
                      <View style={{ flex: 1, gap: 3 }}>
                        <Label color={selected ? colors.accentDeep : colors.mute}>{choice.tag}</Label>
                        <Body size={18} weight="bold">
                          {choice.title}
                        </Body>
                        <Body size={14} color={colors.mute}>
                          {choice.detail}
                        </Body>
                      </View>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          borderWidth: 1.5,
                          borderColor: selected ? colors.accent : colors.lineStrong,
                          backgroundColor: selected ? colors.accent : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {selected ? <Check color={colors.ink} size={14} strokeWidth={3} /> : null}
                      </View>
                    </View>
                  </Card>
                </Pressable>
              </ListEnter>
            );
          })}
        </View>
        <Hand style={{ marginTop: 18, transform: [{ rotate: '-1deg' }] }}>
          {role === 'USER' ? 'points for every good night out' : 'turn regulars into promoters'}
        </Hand>
      </View>
      <View style={{ gap: 4 }}>
        <Button label="Continue" onPress={() => void finish('register')} loading={busy} />
        <Pressable
          accessibilityRole="button"
          onPress={() => void finish('login')}
          disabled={busy}
          style={{ height: 52, alignItems: 'center', justifyContent: 'center' }}>
          <Body size={15} weight="semibold" color={colors.accentDeep} style={{ textDecorationLine: 'underline' }}>
            I already have an account
          </Body>
        </Pressable>
      </View>
    </ScreenEnter>
  );
}
