import { ConfirmDialog } from '@/components/confirm-dialog';
import { useListRefresh } from '@/components/list-refresh';
import { SkeletonBlock } from '@/components/skeleton';
import { AlertsCard } from '@/features/notifications/components/alerts-card';
import { AvatarPicker } from '@/features/profile/components/avatar-picker';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { useProfile } from '@/features/profile/hooks';
import { useAuthStore } from '@/stores/auth';
import { ScreenEnter } from '@/components/ui/enter';
import { BackButton } from '@/components/ui/icon-button';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useProfile();
  const logout = useAuthStore((state) => state.logout);
  const refreshControl = useListRefresh([profile]);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const confirmLogout = () => {
    setConfirmingLogout(false);
    void logout().then(() => {
      router.replace('/(auth)/login');
    });
  };

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center px-4">
        <BackButton />
        <Text className="ml-3 font-display text-title text-haunt-ink">Profile</Text>
      </View>

      {profile.isPending ? (
        <View className="px-6 pt-8">
          <SkeletonBlock height={96} width={96} radius={48} />
          <SkeletonBlock height={28} width="52%" />
          <SkeletonBlock height={160} radius={24} />
        </View>
      ) : null}

      {profile.isError ? (
        <Status
          title="Couldn’t load your profile"
          detail="Check your connection and try again."
          action="Try again"
          onPress={() => {
            void profile.refetch();
          }}
        />
      ) : null}

      {profile.data ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
          refreshControl={refreshControl}
          className="flex-1">
          <View className="px-6 pt-8">
            <AvatarPicker profile={profile.data} />
            <Text className="mt-4 text-center font-display text-title text-haunt-ink">
              {profile.data.username || profile.data.email}
            </Text>
            <View className="mt-3 self-center rounded-full bg-haunt-blush px-3 py-1">
              <Text className="text-sm font-semibold text-haunt-accent">
                {profile.data.role === 'OWNER' ? 'Owner' : 'Member'}
              </Text>
            </View>
            <ProfileForm profile={profile.data} />
            <ChangePasswordForm />
            <AlertsCard role={profile.data.role} pushToken={profile.data.pushToken} />
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirmingLogout(true)}
              className="mt-6 h-14 items-center justify-center">
              <Text className="text-base font-semibold text-haunt-danger">Log out</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : null}

      <ConfirmDialog
        visible={confirmingLogout}
        title="Log out?"
        detail="You can sign back in anytime."
        confirmLabel="Log out"
        tone="danger"
        onConfirm={confirmLogout}
        onClose={() => setConfirmingLogout(false)}
      />

      {!profile.isPending && !profile.isError && !profile.data ? (
        <Status title="No profile yet" detail="Sign in again if this keeps happening." />
      ) : null}
    </ScreenEnter>
  );
}

function Status({
  title,
  detail,
  action,
  onPress,
}: {
  title: string;
  detail: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-center text-2xl font-semibold text-haunt-ink">{title}</Text>
      <Text className="mt-3 text-center text-base text-haunt-mute">{detail}</Text>
      {action && onPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          className="mt-6 h-14 items-center justify-center rounded-2xl bg-haunt-accent px-6">
          <Text className="text-base font-semibold text-haunt-onAccent">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
