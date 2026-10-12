import { ScreenState } from '@/components/screen-state';
import { Ticks } from '@/components/ui/decor';
import { ScreenEnter } from '@/components/ui/enter';
import { Body, H1, Label, Sub } from '@/components/ui/typography';
import { PerkForm } from '@/features/owner/components/perk-form';
import { SetupFinish, SetupWelcome } from '@/features/owner/components/setup-intro';
import { VenueForm } from '@/features/owner/components/venue-form';
import { useMyPerks, useMyVenues } from '@/features/owner/hooks';
import { useProfile, useSetOnboardingStep } from '@/features/profile/hooks';
import { useUserLocation } from '@/features/venues/hooks';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SetupScreen = 'welcome' | 'place' | 'perk' | 'done';

export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useSurfaces();
  const profile = useProfile();
  const venues = useMyVenues();
  const perks = useMyPerks();
  const location = useUserLocation();
  const setStep = useSetOnboardingStep();
  const [screen, setScreen] = useState<SetupScreen | null>(null);
  const step = profile.data?.ownerProfile?.onboardingStep ?? 0;
  const hasVenue = (venues.data?.length ?? 0) > 0;
  const hasPerk = (perks.data?.length ?? 0) > 0;

  const loaded = profile.isSuccess && venues.isSuccess && perks.isSuccess;
  const alreadyDone = loaded && screen === null && step >= 3;

  if (loaded && screen === null && step < 3) {
    setScreen(hasVenue && hasPerk ? 'done' : hasVenue ? 'perk' : step === 0 ? 'welcome' : 'place');
  }

  useEffect(() => {
    if (alreadyDone) router.replace('/(owner)/(tabs)');
  }, [alreadyDone, router]);

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
      <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 18 }}>
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
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 18 }}>
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
          <Label color={colors.accentDeep}>{place ? 'Step 1 of 2' : 'Step 2 of 2'}</Label>
          {place ? null : (
            <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setScreen('done')}>
              <Body size={15} weight="bold" color={colors.accentDeep} style={{ textDecorationLine: 'underline' }}>
                Not now
              </Body>
            </Pressable>
          )}
        </View>
        <Ticks progress={place ? 0.5 : 1} />
        <H1 size={28} style={{ marginTop: 8 }}>
          {place ? 'Add your place' : 'Add a perk'}
        </H1>
        <Sub>{place ? 'Guests earn points when a visit here is approved.' : 'This is what they can spend those points on.'}</Sub>
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
