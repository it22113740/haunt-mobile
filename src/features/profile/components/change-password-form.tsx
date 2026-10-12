import { Button } from '@/components/ui/button';
import { Body, H2, Sub } from '@/components/ui/typography';
import { TextField } from '@/features/auth/components/text-field';
import { useChangePassword } from '@/features/auth/hooks';
import { changePasswordSchema, type ChangePasswordValues } from '@/features/auth/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

export function ChangePasswordForm() {
  const { colors } = useSurfaces();
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
    <View style={{ gap: 18 }}>
      <View style={{ gap: 4 }}>
        <H2>Password</H2>
        <Sub size={14}>Pick one you don’t use anywhere else.</Sub>
      </View>
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
            revealable={false}
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
            revealable={false}
            autoComplete="new-password"
            placeholder="8 characters or more"
          />
        )}
      />
      {formError ? (
        <Body size={14} color={colors.danger}>
          {formError}
        </Body>
      ) : null}
      {saved ? (
        <Body size={14} weight="semibold" color={colors.good}>
          Password updated.
        </Body>
      ) : null}
      <Button
        label="Update password"
        variant="secondary"
        size="sm"
        className="self-start"
        onPress={onSubmit}
        loading={change.isPending}
      />
    </View>
  );
}
