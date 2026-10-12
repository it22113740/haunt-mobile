import { Button } from '@/components/ui/button';
import { Body } from '@/components/ui/typography';
import { TextField } from '@/features/auth/components/text-field';
import { useUpdateProfile } from '@/features/profile/hooks';
import { profileFormSchema, type Profile, type ProfileFormValues } from '@/features/profile/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const { colors } = useSurfaces();
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
    <View style={{ gap: 18 }}>
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
      {formError ? (
        <Body size={14} color={colors.danger}>
          {formError}
        </Body>
      ) : null}
      {saved ? (
        <Body size={14} weight="semibold" color={colors.good}>
          Saved.
        </Body>
      ) : null}
      <Button label="Save changes" size="sm" className="self-start" onPress={onSubmit} loading={update.isPending} />
    </View>
  );
}
