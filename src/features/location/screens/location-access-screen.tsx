import { PrimaryButton } from '@/features/auth/components/primary-button';
import { startGeofenceUpdates } from '@/features/location/tracking';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { ScreenEnter } from '@/components/ui/enter';
import { BackButton } from '@/components/ui/icon-button';
import { hapticWarning } from '@/components/ui/press';
import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Step = 'foreground' | 'background' | 'done';

export function LocationAccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('foreground');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    void (async () => {
      const foreground = await Location.getForegroundPermissionsAsync();
      if (!foreground.granted) return;
      const background = await Location.getBackgroundPermissionsAsync();
      setStep(background.granted ? 'done' : 'background');
    })();
  }, []);

  const allowForeground = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (Platform.OS === 'web') {
        setMessage('On a phone, Haunt shows the system prompt here, then continues to background access.');
        setStep('background');
        return;
      }
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        hapticWarning();
        setMessage('Location stays off while you use Haunt until you allow it. Background access comes after that.');
        return;
      }
      setStep('background');
    } finally {
      setBusy(false);
    }
  };

  const allowBackground = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (Platform.OS === 'web') {
        setMessage('Background location runs in the iPhone and Android app, after foreground access is allowed.');
        return;
      }
      const foreground = await Location.getForegroundPermissionsAsync();
      if (!foreground.granted) {
        hapticWarning();
        setStep('foreground');
        setMessage('Allow location while using Haunt before background access.');
        return;
      }
      const permission = await Location.requestBackgroundPermissionsAsync();
      if (!permission.granted) {
        hapticWarning();
        setMessage('Background location stays off. Arrival alerts need that permission.');
        return;
      }
      const started = await startGeofenceUpdates();
      if (!started) {
        hapticWarning();
        setMessage('Permission is on, but arrival checks could not start. Try again.');
        return;
      }
      setStep('done');
    } finally {
      setBusy(false);
    }
  };

  const title =
    step === 'foreground' ? 'While Haunt is open' : step === 'background' ? 'When Haunt is closed' : 'Arrival alerts are on';
  const body =
    step === 'foreground'
      ? 'Haunt uses your location to show restaurants and bars around you, and to know when you are standing at one. This first prompt is only for while the app is open.'
      : step === 'background'
        ? 'The next prompt lets Haunt notice you arrived even if the app is closed. Each update sends your current latitude and longitude so Haunt can check the places you are inside. You can turn this off in system settings.'
        : 'Haunt will check your location in the background and send an arrival note when you are inside a place.';

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-4">
        <BackButton />
      </View>
      <View className="flex-1 justify-end px-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <Text className="text-sm font-semibold uppercase tracking-wide text-haunt-mute">
          {step === 'done' ? 'Ready' : step === 'foreground' ? 'Step 1 of 2' : 'Step 2 of 2'}
        </Text>
        <Text className="mt-3 font-display text-display-lg text-haunt-ink">{title}</Text>
        <Text className="mt-4 text-base leading-6 text-haunt-mute">{body}</Text>
        {message ? <Text className="mt-4 text-sm leading-5 text-haunt-ink">{message}</Text> : null}
        <View className="mt-8 gap-3">
          {step === 'foreground' ? (
            <PrimaryButton label="Continue" loading={busy} onPress={() => void allowForeground()} />
          ) : null}
          {step === 'background' ? (
            <PrimaryButton label="Allow background location" loading={busy} onPress={() => void allowBackground()} />
          ) : null}
          {step === 'done' ? <PrimaryButton label="Done" onPress={() => router.back()} /> : null}
          {step !== 'done' ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              className="h-14 items-center justify-center">
              <Text className="text-base font-semibold text-haunt-ink">Not now</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </ScreenEnter>
  );
}
