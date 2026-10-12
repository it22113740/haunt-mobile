import { PressScale } from '@/components/ui/press-scale';
import { Avatar } from '@/components/ui/avatar';
import { BackButton } from '@/components/ui/icon-button';
import { H1, H2, Label, MarkedHeading, Sub, Wordmark } from '@/components/ui/typography';
import { useAuthStore } from '@/stores/auth';
import { useHuntTheme } from '@/theme/colors';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

export function ProfileAvatarButton() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const name = user?.username || user?.email;
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel="Your profile"
      hitSlop={4}
      onPress={() => router.push(role === 'OWNER' ? '/(owner)/profile' : '/(user)/profile')}
      >
      <Avatar imageUrl={user?.imageUrl} name={name} />
    </PressScale>
  );
}

type AppHeaderProps = {
  /** Page title. Without it the header shows the wordmark. */
  title?: string;
  /** Scribble-underline the title in the white style. */
  markTitle?: boolean;
  /** Small mono label beside the wordmark ("for business"). */
  tag?: string;
  /** Right slot. Defaults to the profile avatar; pass `null` to hide. */
  right?: ReactNode;
};

export function AppHeader({ title, markTitle = false, tag, right }: AppHeaderProps) {
  const { isWhite } = useHuntTheme();
  const trailing = right === undefined ? <ProfileAvatarButton /> : right;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
      {title ? (
        markTitle && isWhite ? (
          <MarkedHeading mark={title} size={28} />
        ) : (
          <H1 size={28}>{title}</H1>
        )
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
          <Wordmark />
          {tag ? <Label style={{ marginBottom: 5 }}>{tag}</Label> : null}
        </View>
      )}
      {trailing}
    </View>
  );
}

/** Back button followed by either a mono label ("Profile") or an h2 title ("New offer"). */
export function BackHeader({ title, label, onBack }: { title?: string; label?: string; onBack?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <BackButton onPress={onBack} />
      {title ? (
        <H2 size={22} style={{ flex: 1 }} numberOfLines={1}>
          {title}
        </H2>
      ) : null}
      {label ? <Label>{label}</Label> : null}
    </View>
  );
}

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  markTitle?: boolean;
};

/** Page title (h1 28) with an optional muted subtitle. */
export function ScreenHeader({ title, subtitle, right, markTitle = false }: ScreenHeaderProps) {
  const { isWhite } = useHuntTheme();
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {markTitle && isWhite ? <MarkedHeading mark={title} size={28} /> : <H1 size={28}>{title}</H1>}
        {right}
      </View>
      {subtitle ? <Sub>{subtitle}</Sub> : null}
    </View>
  );
}
