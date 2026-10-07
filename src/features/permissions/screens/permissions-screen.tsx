import { Illustration, type IllustrationName } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { ScreenEnter } from '@/components/ui/enter';
import { hapticWarning } from '@/components/ui/press';
import { enablePushNotifications } from '@/features/notifications/push';
import { useLaunchFlags } from '@/lib/launch-flags';
import { useHauntColors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
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
    points: [
      'Know when a visit is approved',
      'Get a note as you arrive',
      'See when a perk is ready to use',
    ],
  },
];

export function PermissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useHauntColors();
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
      className="flex-1 justify-between bg-haunt-paper px-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 16) }}>
      <View>
        <Text className="font-sans-semibold text-caption text-haunt-mute">{step + 1} of 2</Text>
        <View className="mt-6 items-center">
          <View className="absolute h-56 w-56 rounded-full bg-haunt-blush" />
          <Illustration name={current.illustration} size={200} />
        </View>
        <Text className="mt-8 font-display text-display-lg text-haunt-ink">{current.title}</Text>
        <View className="mt-6 gap-4">
          {current.points.map((point) => (
            <View key={point} className="flex-row items-center">
              <Check color={colors.good} size={18} />
              <Text className="ml-3 flex-1 font-sans text-body text-haunt-ink">{point}</Text>
            </View>
          ))}
        </View>
        {message ? <Text className="mt-4 font-sans text-caption text-haunt-danger">{message}</Text> : null}
      </View>
      <View className="gap-2">
        <Button label="Allow" onPress={() => void allow()} loading={busy} />
        <Button label="Maybe later" variant="ghost" onPress={later} disabled={busy} />
      </View>
    </ScreenEnter>
  );
}
