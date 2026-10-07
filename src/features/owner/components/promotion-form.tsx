import { Chip } from '@/components/ui/chip';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { FormSection } from '@/features/owner/components/form-section';
import { ImageField } from '@/features/owner/components/image-field';
import { useSavePromotion } from '@/features/owner/hooks';
import {
  promotionFormSchema,
  type OwnerPromotion,
  type OwnerVenue,
  type PromotionFormValues,
} from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PromotionFormProps = {
  promotion?: OwnerPromotion | null;
  venues: OwnerVenue[];
  onSaved: (promotion: OwnerPromotion) => void;
};

export function PromotionForm({ promotion, venues, onSaved }: PromotionFormProps) {
  const insets = useSafeAreaInsets();
  const save = useSavePromotion(promotion?.id);
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      venueId: promotion?.venueId ?? venues[0]?.id ?? '',
      title: promotion?.title ?? '',
      description: promotion?.description ?? '',
      imageUrl: promotion?.imageUrl ?? '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      onSaved(await save.mutateAsync(values));
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not save this promotion.'));
    }
  });

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 16, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <FormSection title="Photo">
          <Controller
            control={form.control}
            name="imageUrl"
            render={({ field }) => <ImageField url={field.value} onChange={field.onChange} />}
          />
        </FormSection>
        <FormSection title="Details">
          {promotion ? (
            <Text className="font-sans text-body text-haunt-mute">{promotion.venue?.name ?? 'This place'}</Text>
          ) : (
            <Controller
              control={form.control}
              name="venueId"
              render={({ field, fieldState }) => (
                <View>
                  <Text className="mb-2 font-sans text-caption text-haunt-mute">Place</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {venues.map((venue) => (
                      <Chip
                        key={venue.id}
                        label={venue.name}
                        selected={field.value === venue.id}
                        onPress={() => field.onChange(venue.id)}
                      />
                    ))}
                  </View>
                  {fieldState.error ? (
                    <Text className="mt-2 font-sans text-caption text-haunt-danger">{fieldState.error.message}</Text>
                  ) : null}
                </View>
              )}
            />
          )}
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <TextField
                label="Title"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                placeholder="Happy hour"
                autoCapitalize="sentences"
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <TextField
                label="Details"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="What guests should know"
                autoCapitalize="sentences"
                multiline
              />
            )}
          />
        </FormSection>
      </ScrollView>
      <View className="bg-haunt-paper px-6 pt-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        {formError ? <Text className="mb-3 font-sans text-caption text-haunt-danger">{formError}</Text> : null}
        <PrimaryButton
          label={promotion ? 'Save promotion' : 'Publish promotion'}
          onPress={() => void onSubmit()}
          loading={save.isPending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
