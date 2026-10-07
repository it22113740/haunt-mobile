import { ScreenState } from '@/components/screen-state';
import { FloatingTabBar } from '@/components/ui/tab-bar';
import { useProfile } from '@/features/profile/hooks';
import { Tabs, useRouter } from 'expo-router';
import { ClipboardCheck, Gift, Megaphone, Store, Ticket } from 'lucide-react-native';
import { useEffect } from 'react';

export default function OwnerTabsLayout() {
  const profile = useProfile();
  const router = useRouter();
  const step = profile.data?.ownerProfile?.onboardingStep ?? 0;
  const incomplete = profile.isSuccess && profile.data.role === 'OWNER' && step < 3;

  useEffect(() => {
    if (incomplete) router.replace('/(owner)/onboarding');
  }, [incomplete, router]);

  if (profile.isPending) return <ScreenState loading title="Loading your places" />;
  if (profile.isError) {
    return (
      <ScreenState
        title="Couldn’t load your account"
        action="Try again"
        onPress={() => void profile.refetch()}
      />
    );
  }
  if (incomplete) return <ScreenState loading title="Setting up" />;

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} raisedRoute="perks" />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Venues',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="promotions"
        options={{
          title: 'Promotions',
          tabBarIcon: ({ color, size }) => <Megaphone color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="perks"
        options={{
          title: 'Perks',
          tabBarIcon: ({ color, size }) => <Gift color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Review',
          tabBarIcon: ({ color, size }) => <ClipboardCheck color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="redemptions"
        options={{
          title: 'Codes',
          tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
