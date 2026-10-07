import { ScreenState } from '@/components/screen-state';
import { ScreenEnter } from '@/components/ui/enter';
import { PerkForm } from '@/features/owner/components/perk-form';
import { SetupFinish, SetupWelcome } from '@/features/owner/components/setup-intro';
import { VenueForm } from '@/features/owner/components/venue-form';
import { useMyPerks, useMyVenues } from '@/features/owner/hooks';
import { useProfile, useSetOnboardingStep } from '@/features/profile/hooks';
import { useUserLocation } from '@/features/venues/hooks';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SetupScreen = 'welcome' | 'place' | 'perk' | 'done';

export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const profile = useProfile();
  const venues = useMyVenues();
  const perks = useMyPerks();
  const location = useUserLocation();
  const setStep = useSetOnboardingStep();
  const picked = useRef(false);
  const [screen, setScreen] = useState<SetupScreen | null>(null);
  const step = profile.data?.ownerProfile?.onboardingStep ?? 0;
  const hasVenue = (venues.data?.length ?? 0) > 0;
  const hasPerk = (perks.data?.length ?? 0) > 0;

  useEffect(() => {
    if (!profile.isSuccess || !venues.isSuccess || !perks.isSuccess || picked.current) return;
    if (step >= 3) {
      router.replace('/(owner)/(tabs)');
      return;
    }
    picked.current = true;
    if (hasVenue && hasPerk) setScreen('done');
    else if (hasVenue) setScreen('perk');
    else if (step === 0) setScreen('welcome');
    else setScreen('place');
  }, [hasPerk, hasVenue, perks.isSuccess, profile.isSuccess, router, step, venues.isSuccess]);

  const openTabs = () => {
    setStep.mutate(3, { onSuccess: () => router.replace('/(owner)/(tabs)') });
  };

  if (profile.isPending || venues.isPending || perks.isPending || screen === null) {
    return <ScreenState loading title="Setting up" />;
  }
  if (profile.isError || venues.isError || perks.isError) {
    return (
      <ScreenState
        title="Couldn’t start setup"
        action="Try again"
        onPress={() => {
          void profile.refetch();
          void venues.refetch();
          void perks.refetch();
        }}
      />
    );
  }
  if (screen === 'place' && !hasVenue && location.isPending) {
    return <ScreenState loading title="Setting up" />;
  }

  if (screen === 'welcome') {
    return (
      <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 16 }}>
        <SetupWelcome done={[hasVenue, hasPerk, false]} onStart={() => setScreen('place')} />
      </ScreenEnter>
    );
  }

  if (screen === 'done') {
    return (
      <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top }}>
        <SetupFinish onDone={openTabs} loading={setStep.isPending} />
      </ScreenEnter>
    );
  }

  const place = screen === 'place';

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 16 }}>
      <View className="px-6">
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-semibold text-caption tracking-widest text-haunt-accent">
            {place ? 'Step 1 of 2' : 'Step 2 of 2'}
          </Text>
          {place ? null : (
            <Pressable accessibilityRole="button" onPress={() => setScreen('done')} className="h-11 justify-center">
              <Text className="font-sans-semibold text-body text-haunt-accent">Not now</Text>
            </Pressable>
          )}
        </View>
        <View className="mt-3 h-2 overflow-hidden rounded-full bg-haunt-blush">
          <View className="h-2 rounded-full bg-haunt-accent" style={{ width: place ? '50%' : '100%' }} />
        </View>
        <Text className="mt-4 font-display text-title text-haunt-ink">{place ? 'Add your place' : 'Add a perk'}</Text>
        <Text className="mt-2 font-sans text-body text-haunt-mute">
          {place ? 'Guests earn points when a visit here is approved.' : 'This is what they can spend those points on.'}
        </Text>
      </View>
      {place ? (
        <VenueForm
          origin={location.data}
          onSaved={() => {
            setStep.mutate(1);
            setScreen('perk');
          }}
        />
      ) : (
        <PerkForm venues={venues.data ?? []} onSaved={() => setScreen('done')} />
      )}
    </ScreenEnter>
  );
}
