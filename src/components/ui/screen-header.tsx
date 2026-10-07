import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-end justify-between px-6">
      <View className="flex-1 pr-4">
        <Text className="font-display text-title text-haunt-ink">{title}</Text>
        {subtitle ? <Text className="mt-2 font-sans text-body text-haunt-mute">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function AppHeader({ greeting }: { greeting?: string }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const name = user?.username || user?.email;

  return (
    <View className="mb-4 flex-row items-center justify-between px-6">
      {greeting ? (
        <Text className="flex-1 pr-3 font-display text-title text-haunt-ink" numberOfLines={2}>
          {greeting}
        </Text>
      ) : (
        <Text className="font-display text-caption tracking-widest text-haunt-accent">HAUNT</Text>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile"
        onPress={() => router.push(role === 'OWNER' ? '/(owner)/profile' : '/(user)/profile')}
        className="h-11 w-11 items-center justify-center">
        <Avatar imageUrl={user?.imageUrl} name={name} />
      </Pressable>
    </View>
  );
}
