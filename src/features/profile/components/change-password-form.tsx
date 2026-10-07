import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { useChangePassword } from '@/features/auth/hooks';
import { changePasswordSchema, type ChangePasswordValues } from '@/features/auth/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

export function ChangePasswordForm() {
  const change = useChangePassword();
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSaved(false);
    try {
      await change.mutateAsync(values);
      form.reset();
      setSaved(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not update your password.'));
    }
  });

  return (
    <View className="mt-8 rounded-3xl bg-haunt-card p-6">
      <Text className="text-base font-semibold text-haunt-ink">Password</Text>
      <Text className="mt-1 text-sm text-haunt-mute">Use a new password you don’t use anywhere else.</Text>
      <View className="mt-4 gap-4">
        <Controller
          control={form.control}
          name="currentPassword"
          render={({ field, fieldState }) => (
            <TextField
              label="Current password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              secure
              autoComplete="password"
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
            />
          )}
        />
      </View>
      {formError ? <Text className="mt-3 text-sm text-haunt-danger">{formError}</Text> : null}
      {saved ? <Text className="mt-3 text-sm font-semibold text-haunt-ink">Password updated.</Text> : null}
      <View className="mt-4">
        <PrimaryButton label="Update password" onPress={onSubmit} loading={change.isPending} />
      </View>
    </View>
  );
}
