import { CameraIcon, ExploreIcon, LogIcon, OffersIcon, WalletIcon } from '@/components/ui/hunt-icons';
import { FloatingTabBar } from '@/components/ui/tab-bar';
import { Tabs } from 'expo-router';

export default function UserTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} raisedRoute="capture" />}
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
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <ExploreIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="promotions"
        options={{
          title: 'Offers',
          tabBarIcon: ({ color, size }) => <OffersIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color, size }) => <CameraIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <WalletIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Log',
          tabBarIcon: ({ color, size }) => <LogIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
