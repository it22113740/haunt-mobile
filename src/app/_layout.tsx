import '@/components/ui/animated';
import '@/global.css';
import '@/features/location/geofence-task';

import { queryClient } from '@/api/query-client';
import { ToastHost } from '@/components/toast';
import { useDeviceServices } from '@/features/notifications/hooks';
import { loadNotifications } from '@/features/notifications/push';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useLaunchFlags } from '@/lib/launch-flags';
import { useAuthStore } from '@/stores/auth';
import { hauntCssVariables, useHauntColors, useHauntVars } from '@/theme/colors';
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, useColorScheme, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = useHauntColors();
  const themeVars = useHauntVars();
  const hydrate = useAuthStore((state) => state.hydrate);
  const loadFlags = useLaunchFlags((state) => state.load);
  const [sessionReady, setSessionReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });
  useAuthRedirect();
  useDeviceServices();
  const navigationTheme =
    colorScheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: colors.paper,
            card: colors.card,
            text: colors.ink,
            border: colors.line,
            primary: colors.accent,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: colors.paper,
            card: colors.card,
            text: colors.ink,
            border: colors.line,
            primary: colors.accent,
          },
        };

  useEffect(() => {
    void loadNotifications();
    void Promise.all([hydrate(), loadFlags()]).finally(() => setSessionReady(true));
  }, [hydrate, loadFlags]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && sessionReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded, sessionReady]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const variables = hauntCssVariables(colors);
    for (const [name, value] of Object.entries(variables)) {
      document.documentElement.style.setProperty(name, value);
    }
  }, [colors]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={[{ flex: 1, backgroundColor: colors.paper }, themeVars]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <ThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }} />
          <ToastHost />
        </ThemeProvider>
      </View>
    </QueryClientProvider>
  );
}
