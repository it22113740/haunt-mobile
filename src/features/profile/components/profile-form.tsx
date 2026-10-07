import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { useUpdateProfile } from '@/features/profile/hooks';
import { profileFormSchema, type Profile, type ProfileFormValues } from '@/features/profile/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const update = useUpdateProfile(profile.role);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema(profile.role)),
    values: {
      username: profile.username ?? '',
      email: profile.email,
      gmail: profile.ownerProfile?.gmail ?? '',
      address: profile.ownerProfile?.address ?? '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSaved(false);
    try {
      await update.mutateAsync(values);
      setSaved(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not save your profile.'));
    }
  });

  return (
    <View className="mt-8 gap-4">
      {profile.role === 'USER' ? (
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
              autoComplete="username"
            />
          )}
        />
      ) : null}
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            label="Account email"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="email-address"
            autoComplete="email"
          />
        )}
      />
      {profile.role === 'OWNER' ? (
        <>
          <Controller
            control={form.control}
            name="gmail"
            render={({ field, fieldState }) => (
              <TextField
                label="Business email"
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
            name="address"
            render={({ field, fieldState }) => (
              <TextField
                label="Business address"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                autoCapitalize="words"
              />
            )}
          />
        </>
      ) : null}
      {formError ? <Text className="text-sm text-haunt-danger">{formError}</Text> : null}
      {saved ? <Text className="text-sm font-semibold text-haunt-ink">Profile saved.</Text> : null}
      <PrimaryButton label="Save profile" onPress={onSubmit} loading={update.isPending} />
    </View>
  );
}
