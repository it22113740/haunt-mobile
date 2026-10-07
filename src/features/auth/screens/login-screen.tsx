import { AuthScaffold, TextLink } from '@/features/auth/components/auth-scaffold';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { useLogin } from '@/features/auth/hooks';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useAuthStore } from '@/stores/auth';
import { useHauntColors } from '@/theme/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

export function LoginScreen() {
  const router = useRouter();
  const establishSession = useAuthStore((state) => state.establishSession);
  const login = useLogin();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const colors = useHauntColors();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    try {
      const session = await login.mutateAsync(values);
      await establishSession(session.accessToken);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not sign in. Check your email and password.'));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScaffold
      illustration="onb-discover"
      title="Welcome back"
      subtitle="Sign in to pick up rewards at the places you haunt."
      footer={
        <>
          {formError ? <Text className="mb-3 text-center text-sm text-haunt-danger">{formError}</Text> : null}
          <PrimaryButton label="Sign in" onPress={onSubmit} loading={submitting} />
          <TextLink
            label="New here?"
            action="Create an account"
            onPress={() => router.push('/(auth)/register')}
          />
        </>
      }>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            label="Email"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="email-address"
            autoComplete="email"
                placeholder="you@email.com"
                leftIcon={<Mail color={colors.mute} size={18} />}
              />
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            label="Password"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            secure
            autoComplete="password"
            placeholder="Your password"
            leftIcon={<Lock color={colors.mute} size={18} />}
          />
        )}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/(auth)/forgot-password')}
        className="h-11 items-end justify-center">
        <Text className="text-sm font-semibold text-haunt-ink">Forgot password</Text>
      </Pressable>
    </AuthScaffold>
  );
}
