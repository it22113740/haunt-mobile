import { Hand } from '@/components/ui/typography';
import { AuthScaffold, FormError, InlineLink } from '@/features/auth/components/auth-scaffold';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { useForgotPassword, useResetPassword } from '@/features/auth/hooks';
import { resetPasswordSchema, type ResetPasswordValues } from '@/features/auth/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export function ResetPasswordScreen() {
  const router = useRouter();
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
        illustration="success-sent"
        title="Password updated"
        subtitle="Your password is saved. The next sign-in uses this one."
        footer={<PrimaryButton label="Sign in" onPress={() => router.replace('/(auth)/login')} />}>
        <Hand>all set, go grab a drink</Hand>
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
          <FormError message={formError} />
          <FormError message={notice} tone="info" />
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
            large
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
            placeholder="8 characters or more"
          />
        )}
      />
      <InlineLink
        label={resend.isPending ? 'Sending…' : 'Send a new code'}
        align="center"
        onPress={() => {
          void onResend();
        }}
      />
    </AuthScaffold>
  );
}
