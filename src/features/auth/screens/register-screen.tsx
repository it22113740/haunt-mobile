import { AuthScaffold, TextLink } from '@/features/auth/components/auth-scaffold';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { RoleSwitch } from '@/features/auth/components/role-switch';
import { TextField } from '@/features/auth/components/text-field';
import { useRegister } from '@/features/auth/hooks';
import { registerSchema, type RegisterValues } from '@/features/auth/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useAuthStore } from '@/stores/auth';
import { useHauntColors } from '@/theme/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Lock, Mail, MapPin, User } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native';

export function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string | string[] }>();
  const roleParam = Array.isArray(params.role) ? params.role[0] : params.role;
  const preset = roleParam === 'OWNER' ? 'OWNER' : 'USER';
  const colors = useHauntColors();
  const establishSession = useAuthStore((state) => state.establishSession);
  const register = useRegister();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: preset,
      username: '',
      email: '',
      gmail: '',
      address: '',
      password: '',
    },
  });
  const role = form.watch('role');

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    try {
      const session = await register.mutateAsync(values);
      await establishSession(session.accessToken);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not create your account.'));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScaffold
      illustration="onb-earn"
      title="Join Haunt"
      subtitle={
        role === 'USER'
          ? 'Collect points at the restaurants and bars you keep coming back to.'
          : 'Set up the place you run, then reward the people who return.'
      }
      onBack={() => {
        if (router.canGoBack()) router.back();
        else router.replace('/(auth)/login');
      }}
      footer={
        <>
          {formError ? <Text className="mb-3 text-center text-sm text-haunt-danger">{formError}</Text> : null}
          <PrimaryButton label="Create account" onPress={onSubmit} loading={submitting} />
          <TextLink
            label="Already have an account?"
            action="Sign in"
            onPress={() => router.replace('/(auth)/login')}
          />
        </>
      }>
      <RoleSwitch value={role} onChange={(next) => form.setValue('role', next)} />
      {role === 'USER' ? (
        <>
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <TextField
                label="Username"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                autoCapitalize="none"
                autoComplete="username"
                placeholder="johndoe"
                leftIcon={<User color={colors.mute} size={18} />}
              />
            )}
          />
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
        </>
      ) : (
        <>
          <Controller
            control={form.control}
            name="gmail"
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                keyboardType="email-address"
                autoComplete="email"
                placeholder="owner@email.com"
                leftIcon={<Mail color={colors.mute} size={18} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <TextField
                label="Business address"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                autoCapitalize="words"
                placeholder="123 Main St"
                leftIcon={<MapPin color={colors.mute} size={18} />}
              />
            )}
          />
        </>
      )}
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            leftIcon={<Lock color={colors.mute} size={18} />}
          />
        )}
      />
    </AuthScaffold>
  );
}
