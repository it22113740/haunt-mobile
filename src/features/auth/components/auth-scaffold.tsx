import { Illustration, type IllustrationName } from '@/components/illustration';
import { ScreenEnter } from '@/components/ui/enter';
import { BackButton } from '@/components/ui/icon-button';
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
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}>
          <View
            className="flex-1 justify-between px-6"
            style={{
              flexGrow: 1,
              paddingTop: insets.top + 16,
              paddingBottom: Math.max(insets.bottom, 16),
            }}>
            <View>
              {onBack ? (
                <View className="mb-8">
                  <BackButton onPress={onBack} />
                </View>
              ) : (
                <Text className="mb-6 font-display text-caption tracking-widest text-haunt-accent">HAUNT</Text>
              )}
              {illustration ? (
                <View className="mb-6 items-center">
                  <View className="absolute h-36 w-36 rounded-full bg-haunt-blush" />
                  <Illustration name={illustration} size={132} />
                </View>
              ) : null}
              <Text className="font-display text-display-lg text-haunt-ink">{title}</Text>
              <Text className="mt-3 font-sans text-body text-haunt-mute">{subtitle}</Text>
              <View className="mt-8 gap-4">{children}</View>
            </View>
            <View className="pt-8">{footer}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenEnter>
  );
}

type TextLinkProps = {
  label: string;
  action: string;
  onPress: () => void;
};

export function TextLink({ label, action, onPress }: TextLinkProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="mt-2 h-11 items-center justify-center">
      <Text className="text-sm text-haunt-mute">
        {label} <Text className="font-semibold text-haunt-ink">{action}</Text>
      </Text>
    </Pressable>
  );
}
