import { Toggle } from '@/components/ui/controls';
import { Body, H2, Sub } from '@/components/ui/typography';
import { isGeofenceActive } from '@/features/location/tracking';
import { useEnablePush, useTestPush } from '@/features/notifications/hooks';
import type { Profile } from '@/features/profile/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import { isAxiosError } from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, AppState, Linking, Platform, Pressable, View } from 'react-native';

type AlertsCardProps = {
  role: Profile['role'];
  pushToken: string | null | undefined;
};

function noticeFrom(error: unknown, fallback: string): string {
  if (isAxiosError(error)) return getApiErrorMessage(error, fallback);
  if (error instanceof Error && error.message.length > 0) return error.message;
  return fallback;
}

function openSystemSettings() {
  if (Platform.OS === 'web') return;
  void Linking.openSettings().catch(() => undefined);
}

function useArrivalTracking(enabled: boolean) {
  const [active, setActive] = useState(false);

  const refresh = useCallback(() => {
    if (!enabled) return;
    void isGeofenceActive().then(setActive);
  }, [enabled]);

  useFocusEffect(refresh);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  return active;
}

export function AlertsCard({ role, pushToken }: AlertsCardProps) {
  const router = useRouter();
  const { colors } = useSurfaces();
  const enablePush = useEnablePush();
  const testPush = useTestPush();
  const pushOn = Boolean(pushToken) || enablePush.isSuccess;
  const arrivalOn = useArrivalTracking(role === 'USER');

  const pushNotice = enablePush.isError ? noticeFrom(enablePush.error, 'Couldn’t turn on notifications.') : null;

  const testNotice = testPush.isError
    ? noticeFrom(testPush.error, 'Couldn’t send the test push.')
    : testPush.data
      ? testPush.data.sent
        ? 'Sent. Check this phone for the notification.'
        : (testPush.data.reason ?? 'The push was not sent.')
      : null;

  return (
    <View style={{ gap: 4 }}>
      <H2 style={{ marginBottom: 8 }}>Nudges</H2>
      <NudgeRow
        title="Visit updates"
        body={
          role === 'OWNER'
            ? 'Hear when guests send shots for review or claim a perk.'
            : 'Hear when a place approves your shots or your points land.'
        }
        value={pushOn}
        busy={enablePush.isPending}
        onChange={(next) => {
          if (next) enablePush.mutate();
          else openSystemSettings();
        }}
      />
      {role === 'USER' ? (
        <NudgeRow
          title="Arrival alerts"
          body="Hunt notices when you walk into a place and reminds you to capture it. Uses your location in the background."
          value={arrivalOn}
          onChange={(next) => {
            if (next) router.push('/(user)/location');
            else openSystemSettings();
          }}
        />
      ) : null}
      {pushNotice ? (
        <Sub size={14} color={colors.danger} style={{ paddingTop: 10 }}>
          {pushNotice}
        </Sub>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ busy: testPush.isPending, disabled: testPush.isPending }}
        disabled={testPush.isPending}
        onPress={() => {
          testPush.mutate();
        }}
        style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 }}>
        <Body size={14} weight="semibold" color={colors.accentDeep} style={{ textDecorationLine: 'underline' }}>
          Send me a test nudge
        </Body>
        {testPush.isPending ? <ActivityIndicator size="small" color={colors.accentDeep} /> : null}
      </Pressable>
      {testNotice ? <Sub size={14}>{testNotice}</Sub> : null}
    </View>
  );
}

function NudgeRow({
  title,
  body,
  value,
  busy = false,
  onChange,
}: {
  title: string;
  body: string;
  value: boolean;
  busy?: boolean;
  onChange: (next: boolean) => void;
}) {
  const { colors } = useSurfaces();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}>
      <View style={{ flex: 1, gap: 3 }}>
        <Body size={16} weight="bold">
          {title}
        </Body>
        <Sub size={14} style={{ lineHeight: 20 }}>
          {body}
        </Sub>
      </View>
      {busy ? (
        <View style={{ width: 52, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <Toggle value={value} onValueChange={onChange} accessibilityLabel={title} />
      )}
    </View>
  );
}
