import { ScreenState } from '@/components/screen-state';
import { useLaunchFlags } from '@/lib/launch-flags';
import { useAuthStore } from '@/stores/auth';
import { Redirect } from 'expo-router';

export default function Index() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const error = useAuthStore((state) => state.error);
  const hydrate = useAuthStore((state) => state.hydrate);
  const flagsReady = useLaunchFlags((state) => state.ready);
  const onboarded = useLaunchFlags((state) => state.onboarded);
  const permsAsked = useLaunchFlags((state) => state.permsAsked);

  if (!isHydrated || !flagsReady || (token && !role && !error)) return null;

  if (token && !role && error) {
    return (
      <ScreenState
        title="Couldn’t load your account"
        detail={error}
        action="Try again"
        onPress={() => {
          void hydrate();
        }}
      />
    );
  }

  if (!onboarded) return <Redirect href="/(onboarding)" />;
  if (!token) return <Redirect href="/(auth)/login" />;
  if (role === 'OWNER') return <Redirect href="/(owner)/(tabs)" />;
  if (role === 'USER' && !permsAsked) return <Redirect href="/(user)/permissions" />;
  if (role === 'USER') return <Redirect href="/(user)/(tabs)" />;

  return null;
}
