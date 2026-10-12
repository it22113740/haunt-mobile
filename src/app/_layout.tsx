import '@/components/ui/animated';
import '@/global.css';
import '@/features/location/geofence-task';

import { queryClient } from '@/api/query-client';
import { LaunchSplash } from '@/components/launch-splash';
import { ToastHost } from '@/components/toast';
import { useDeviceServices } from '@/features/notifications/hooks';
import { loadNotifications } from '@/features/notifications/push';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useLaunchFlags } from '@/lib/launch-flags';
import { useAuthStore } from '@/stores/auth';
import { huntCssVariables, useHuntColors, useHuntVars } from '@/theme/colors';
import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { Caveat_500Medium, Caveat_600SemiBold } from '@expo-google-fonts/caveat';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { NavigationBar } from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StatusBar as NativeStatusBar, Platform, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

// Every mounted StatusBar re-applies these defaults on Android; without them some devices (and Expo Go)
// fall back to an opaque black bar that hides the dark icons. Screens pad themselves with the top inset.
if (Platform.OS === 'android') {
  NativeStatusBar.setTranslucent(true);
  NativeStatusBar.setBackgroundColor('transparent');
}

export default function RootLayout() {
  const colors = useHuntColors();
  const themeVars = useHuntVars();
  const hydrate = useAuthStore((state) => state.hydrate);
  const loadFlags = useLaunchFlags((state) => state.load);
  const [sessionReady, setSessionReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    Caveat_500Medium,
    Caveat_600SemiBold,
  });
  useAuthRedirect();
  useDeviceServices();
  // Both visual styles (journal and white) are light surfaces, so navigation chrome is always light
  // and the system bar icons stay dark even when the device is in dark mode.
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.paper,
      card: colors.paper,
      text: colors.ink,
      border: colors.line,
      primary: colors.accent,
    },
  };

  useEffect(() => {
    void loadNotifications();
    void Promise.all([hydrate(), loadFlags()]).finally(() => setSessionReady(true));
  }, [hydrate, loadFlags]);

  const appReady = Boolean(fontsLoaded || fontError) && sessionReady;

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const variables = huntCssVariables(colors);
    for (const [name, value] of Object.entries(variables)) {
      document.documentElement.style.setProperty(name, value);
    }
  }, [colors]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={[{ flex: 1, backgroundColor: colors.paper }, themeVars]}>
        <StatusBar style="dark" animated />
        <NavigationBar style="dark" />
        <ThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }} />
          <ToastHost />
        </ThemeProvider>
        <LaunchSplash ready={appReady} />
      </View>
    </QueryClientProvider>
  );
}
