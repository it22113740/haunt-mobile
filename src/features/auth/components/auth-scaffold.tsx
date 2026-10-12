import { Illustration, type IllustrationName } from '@/components/illustration';
import { ScreenEnter } from '@/components/ui/enter';
import { BackButton } from '@/components/ui/icon-button';
import { StatusBarScrim } from '@/components/ui/status-bar-scrim';
import { Body, H1, Sub, Wordmark } from '@/components/ui/typography';
import { useSurfaces } from '@/theme/surfaces';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthScaffoldProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  onBack?: () => void;
  illustration?: IllustrationName;
};

export function AuthScaffold({ title, subtitle, children, footer, onBack, illustration }: AuthScaffoldProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScreenEnter className="flex-1 bg-haunt-paper">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingTop: insets.top + 18,
              paddingBottom: Math.max(insets.bottom, 14) + 10,
            }}>
            <View>
              <View style={{ minHeight: 44, justifyContent: 'center', marginBottom: 18 }}>
                {onBack ? <BackButton onPress={onBack} /> : <Wordmark />}
              </View>
              {illustration ? (
                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                  <Illustration name={illustration} size={168} />
                </View>
              ) : null}
              <View style={{ gap: 8 }}>
                <H1 accessibilityRole="header">{title}</H1>
                <Sub>{subtitle}</Sub>
              </View>
              <View style={{ marginTop: 28, gap: 18 }}>{children}</View>
            </View>
            <View style={{ paddingTop: 28, gap: 6 }}>{footer}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBarScrim />
    </ScreenEnter>
  );
}

type TextLinkProps = {
  label: string;
  action: string;
  onPress: () => void;
};

export function TextLink({ label, action, onPress }: TextLinkProps) {
  const { colors } = useSurfaces();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} ${action}`}
      onPress={onPress}
      style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: 'BricolageGrotesque_400Regular', fontSize: 14, color: colors.mute }}>
        {label}{' '}
        <Text
          style={{
            fontFamily: 'BricolageGrotesque_700Bold',
            color: colors.accentDeep,
            textDecorationLine: 'underline',
          }}>
          {action}
        </Text>
      </Text>
    </Pressable>
  );
}

/** Small underlined link, e.g. "Forgot password". */
export function InlineLink({
  label,
  onPress,
  align = 'flex-end',
}: {
  label: string;
  onPress: () => void;
  align?: 'flex-start' | 'center' | 'flex-end';
}) {
  const { colors } = useSurfaces();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      style={{ alignSelf: align, minHeight: 44, justifyContent: 'center' }}>
      <Body size={14} weight="semibold" color={colors.accentDeep} style={{ textDecorationLine: 'underline' }}>
        {label}
      </Body>
    </Pressable>
  );
}

export function FormError({ message, tone = 'danger' }: { message: string | null; tone?: 'danger' | 'info' }) {
  const { colors } = useSurfaces();
  if (!message) return null;
  return (
    <Body
      size={14}
      color={tone === 'danger' ? colors.danger : colors.good}
      accessibilityLiveRegion="polite"
      style={{ textAlign: 'center', marginBottom: 6 }}>
      {message}
    </Body>
  );
}
