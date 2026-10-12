import { Illustration, type IllustrationName } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { Ticks } from '@/components/ui/decor';
import { ScreenEnter } from '@/components/ui/enter';
import { hapticWarning } from '@/components/ui/press';
import { Body, H1, Label } from '@/components/ui/typography';
import { enablePushNotifications } from '@/features/notifications/push';
import { useLaunchFlags } from '@/lib/launch-flags';
import { useSurfaces } from '@/theme/surfaces';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const steps: { illustration: IllustrationName; title: string; points: string[] }[] = [
  {
    illustration: 'perm-location',
    title: 'Find places around you',
    points: [
      'See restaurants and bars near you',
      'Know when you are standing at one',
      'Capture a visit from inside the venue',
    ],
  },
  {
    illustration: 'perm-notify',
    title: 'Hear when it counts',
    points: ['Know when a visit is approved', 'Get a note as you arrive', 'See when a perk is ready to use'],
  },
];

export function PermissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useSurfaces();
  const completePermissions = useLaunchFlags((state) => state.completePermissions);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const current = steps[step] ?? steps[0];

  const finish = async () => {
    await completePermissions();
    router.replace('/(user)/(tabs)');
  };

  const allow = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (step === 0) {
        await Location.requestForegroundPermissionsAsync();
        setStep(1);
        return;
      }
      await enablePushNotifications(true);
      await finish();
    } catch (error) {
      hapticWarning();
      setMessage(error instanceof Error ? error.message : 'That permission could not be turned on.');
    } finally {
      setBusy(false);
    }
  };

  const later = () => {
    setMessage(null);
    if (step === 0) {
      setStep(1);
      return;
    }
    void finish();
  };

  return (
    <ScreenEnter
      className="flex-1 bg-hunt-paper"
      style={{
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: insets.top + 24,
        paddingBottom: Math.max(insets.bottom, 14) + 10,
      }}>
      <View>
        <View style={{ gap: 8 }}>
          <Label color={colors.accentDeep}>{`Step ${step + 1} of 2`}</Label>
          <Ticks progress={(step + 1) / 2} />
        </View>
        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <Illustration name={current.illustration} size={220} />
        </View>
        <H1 style={{ marginTop: 14 }}>{current.title}</H1>
        <View style={{ marginTop: 18 }}>
          {current.points.map((point) => (
            <View
              key={point}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
              }}>
              <Check color={colors.good} size={18} strokeWidth={2.4} />
              <Body size={16} style={{ flex: 1 }}>
                {point}
              </Body>
            </View>
          ))}
        </View>
        {message ? (
          <Body size={14} color={colors.danger} style={{ marginTop: 14 }} accessibilityLiveRegion="polite">
            {message}
          </Body>
        ) : null}
      </View>
      <View style={{ gap: 8 }}>
        <Button label="Allow" onPress={() => void allow()} loading={busy} />
        <Button label="Maybe later" variant="ghost" onPress={later} disabled={busy} />
      </View>
    </ScreenEnter>
  );
}
