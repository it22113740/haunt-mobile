import { getApiErrorMessage } from '@/lib/api-error';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { useEnablePush, useTestPush } from '@/features/notifications/hooks';
import type { Profile } from '@/features/profile/schemas';
import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

type AlertsCardProps = {
  role: Profile['role'];
  pushToken: string | null | undefined;
};

function noticeFrom(error: unknown, fallback: string): string {
  if (isAxiosError(error)) return getApiErrorMessage(error, fallback);
  if (error instanceof Error && error.message.length > 0) return error.message;
  return fallback;
}

export function AlertsCard({ role, pushToken }: AlertsCardProps) {
  const router = useRouter();
  const enablePush = useEnablePush();
  const testPush = useTestPush();
  const registered = Boolean(pushToken);

  const pushNotice = enablePush.isError
    ? noticeFrom(enablePush.error, 'Couldn’t turn on notifications.')
    : enablePush.isSuccess
      ? 'This phone is registered for Haunt notifications.'
      : null;

  const testNotice = testPush.isError
    ? noticeFrom(testPush.error, 'Couldn’t send the test push.')
    : testPush.data
      ? testPush.data.sent
        ? 'Sent. Check this phone for the notification.'
        : (testPush.data.reason ?? 'The push was not sent.')
      : null;

  return (
    <View className="mt-8">
      <Text className="text-sm font-semibold uppercase tracking-wide text-haunt-mute">Notifications</Text>
      <Text className="mt-3 text-2xl font-semibold text-haunt-ink">Hear when something happens</Text>
      <Text className="mt-3 text-base leading-6 text-haunt-mute">
        Haunt asks to send notifications, then saves this phone’s Expo push token on your profile. That’s how a
        test and an arrival note reach you.
      </Text>
      <Text className="mt-4 text-base font-semibold text-haunt-ink">
        {registered ? 'Token saved' : 'No token yet'}
      </Text>
      <View className="mt-4 gap-3">
        <PrimaryButton
          label="Allow notifications"
          loading={enablePush.isPending}
          onPress={() => {
            enablePush.mutate();
          }}
        />
        <PrimaryButton
          label="Send test push"
          loading={testPush.isPending}
          onPress={() => {
            testPush.mutate();
          }}
        />
      </View>
      {pushNotice ? <Text className="mt-3 text-sm leading-5 text-haunt-mute">{pushNotice}</Text> : null}
      {testNotice ? <Text className="mt-2 text-sm leading-5 text-haunt-ink">{testNotice}</Text> : null}

      {role === 'USER' ? (
        <View className="mt-8">
          <Text className="text-sm font-semibold uppercase tracking-wide text-haunt-mute">Arrival alerts</Text>
          <Text className="mt-3 text-2xl font-semibold text-haunt-ink">Notice when you walk in</Text>
          <Text className="mt-3 text-base leading-6 text-haunt-mute">
            Haunt asks for location while the app is open, then for background location. Each update sends your
            current spot so Haunt can tell you if you’re at a place.
          </Text>
          <View className="mt-4">
            <PrimaryButton
              label="Set up location"
              onPress={() => {
                router.push('/(user)/location');
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
