import { AuthScaffold } from '@/features/auth/components/auth-scaffold';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { useForgotPassword, useResetPassword } from '@/features/auth/hooks';
import { resetPasswordSchema, type ResetPasswordValues } from '@/features/auth/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useHauntColors } from '@/theme/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

export function ResetPasswordScreen() {
  const router = useRouter();
  const colors = useHauntColors();
  const params = useLocalSearchParams<{ email?: string }>();
  const initialEmail = typeof params.email === 'string' ? params.email : '';
  const reset = useResetPassword();
  const resend = useForgotPassword();
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: initialEmail, otp: '', newPassword: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setNotice(null);
    try {
      await reset.mutateAsync(values);
      setDone(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'That code didn’t work. Request a new one and try again.'));
    }
  });

  const onResend = async () => {
    const email = form.getValues('email');
    const parsed = resetPasswordSchema.shape.email.safeParse(email);
    if (!parsed.success) {
      form.setError('email', { message: 'Enter a valid email' });
      return;
    }
    setFormError(null);
    try {
      await resend.mutateAsync({ email: parsed.data });
      setNotice('A new code is on its way.');
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not send a new code.'));
    }
  };

  if (done) {
    return (
      <AuthScaffold
        title="Password updated"
        subtitle="Sign in with your new password."
        footer={<PrimaryButton label="Sign in" onPress={() => router.replace('/(auth)/login')} />}>
        <Text className="text-base text-haunt-ink">
          Your password is saved. The next sign-in uses this one.
        </Text>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      title="Enter your code"
      subtitle="Use the 6-digit code from your email, then choose a new password."
      onBack={() => {
        if (router.canGoBack()) router.back();
        else router.replace('/(auth)/login');
      }}
      footer={
        <>
          {formError ? <Text className="mb-3 text-center text-sm text-haunt-danger">{formError}</Text> : null}
          {notice ? <Text className="mb-3 text-center text-sm text-haunt-ink">{notice}</Text> : null}
          <PrimaryButton label="Update password" onPress={onSubmit} loading={reset.isPending} />
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
            leftIcon={<Mail color={colors.mute} size={18} />}
          />
        )}
      />
      <Controller
        control={form.control}
        name="otp"
        render={({ field, fieldState }) => (
          <TextField
            label="Code"
            value={field.value}
            onChangeText={(value) => field.onChange(value.replace(/\D/g, '').slice(0, 6))}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="number-pad"
            maxLength={6}
            centered
            placeholder="000000"
          />
        )}
      />
      <Controller
        control={form.control}
        name="newPassword"
        render={({ field, fieldState }) => (
          <TextField
            label="New password"
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
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void onResend();
        }}
        className="h-11 items-center justify-center">
        <Text className="text-sm font-semibold text-haunt-ink">
          {resend.isPending ? 'Sending…' : 'Send a new code'}
        </Text>
      </Pressable>
    </AuthScaffold>
  );
}
