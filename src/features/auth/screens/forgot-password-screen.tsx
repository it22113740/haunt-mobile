import { AuthScaffold } from '@/features/auth/components/auth-scaffold';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { useForgotPassword } from '@/features/auth/hooks';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/features/auth/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useHauntColors } from '@/theme/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native';

export function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useHauntColors();
  const forgot = useForgotPassword();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await forgot.mutateAsync(values);
      router.push({ pathname: '/(auth)/reset-password', params: { email: values.email } });
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not send a code. Try again in a moment.'));
    }
  });

  return (
    <AuthScaffold
      title="Reset your password"
      subtitle="We’ll email a 6-digit code if an account exists for this address."
      onBack={() => {
        if (router.canGoBack()) router.back();
        else router.replace('/(auth)/login');
      }}
      footer={
        <>
          {formError ? <Text className="mb-3 text-center text-sm text-haunt-danger">{formError}</Text> : null}
          <PrimaryButton label="Send code" onPress={onSubmit} loading={forgot.isPending} />
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
    </AuthScaffold>
  );
}
