import { Chip } from '@/components/ui/chip';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { FormSection } from '@/features/owner/components/form-section';
import { ImageField } from '@/features/owner/components/image-field';
import { PinPicker } from '@/features/owner/components/pin-picker';
import { RadiusSlider } from '@/features/owner/components/radius-slider';
import { useSaveVenue } from '@/features/owner/hooks';
import { venueFormSchema, type OwnerVenue, type VenueFormValues } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categories = ['Restaurant', 'Bar', 'Cafe', 'Pub', 'Lounge', 'Other'] as const;

type VenueFormProps = {
  venue?: OwnerVenue | null;
  origin?: { lat: number; lng: number } | null;
  onSaved: (venue: OwnerVenue) => void;
};

export function VenueForm({ venue, origin, onSaved }: VenueFormProps) {
  const insets = useSafeAreaInsets();
  const save = useSaveVenue(venue?.id);
  const [formError, setFormError] = useState<string | null>(null);
  const known = categories.find((item) => item === venue?.category);
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: venue?.name ?? '',
      address: venue?.address ?? '',
      lat: venue?.lat ?? origin?.lat ?? 6.9271,
      lng: venue?.lng ?? origin?.lng ?? 79.8612,
      radiusMeters: venue?.radiusMeters ?? 100,
      pointsPerPhoto: venue?.pointsPerPhoto ?? 10,
      pointsPerVideo: venue?.pointsPerVideo ?? 20,
      imageUrl: venue?.imageUrl ?? '',
      category: known ?? venue?.category ?? 'Restaurant',
      description: venue?.description ?? '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      onSaved(await save.mutateAsync(values));
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not save this place.'));
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
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <TextField
                label="Name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                placeholder="The place guests know"
                autoCapitalize="words"
              />
            )}
          />
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <View>
                <Text className="mb-2 font-sans text-caption text-haunt-mute">Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      selected={field.value === category}
                      onPress={() => field.onChange(category)}
                    />
                  ))}
                </View>
                {fieldState.error ? (
                  <Text className="mt-2 font-sans text-caption text-haunt-danger">{fieldState.error.message}</Text>
                ) : null}
              </View>
            )}
          />
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <TextField
                label="Address"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                placeholder="Street, city"
                autoCapitalize="sentences"
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <TextField
                label="Description"
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
        <FormSection title="Location">
          <Controller
            control={form.control}
            name="lat"
            render={({ field: latField }) => (
              <Controller
                control={form.control}
                name="lng"
                render={({ field: lngField }) => (
                  <Controller
                    control={form.control}
                    name="radiusMeters"
                    render={({ field: radiusField }) => (
                      <View className="gap-4">
                        <PinPicker
                          lat={latField.value}
                          lng={lngField.value}
                          radiusMeters={radiusField.value}
                          onChange={(pin) => {
                            latField.onChange(pin.lat);
                            lngField.onChange(pin.lng);
                          }}
                        />
                        <RadiusSlider value={radiusField.value} onChange={radiusField.onChange} />
                      </View>
                    )}
                  />
                )}
              />
            )}
          />
        </FormSection>
        <FormSection title="Rewards">
          <View className="flex-row gap-4">
            <PointField control={form.control} name="pointsPerPhoto" label="Points per photo" />
            <PointField control={form.control} name="pointsPerVideo" label="Points per video" />
          </View>
        </FormSection>
      </ScrollView>
      <View className="bg-haunt-paper px-6 pt-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        {formError ? <Text className="mb-3 font-sans text-caption text-haunt-danger">{formError}</Text> : null}
        <PrimaryButton label={venue ? 'Save place' : 'Create place'} onPress={() => void onSubmit()} loading={save.isPending} />
      </View>
    </KeyboardAvoidingView>
  );
}

function PointField({
  control,
  name,
  label,
}: {
  control: ReturnType<typeof useForm<VenueFormValues>>['control'];
  name: 'pointsPerPhoto' | 'pointsPerVideo';
  label: string;
}) {
  return (
    <View className="flex-1">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextField
            label={label}
            value={String(field.value)}
            keyboardType="number-pad"
            onChangeText={(text) => field.onChange(Number(text.replace(/\D/g, '')) || 0)}
            onBlur={field.onBlur}
          />
        )}
      />
    </View>
  );
}
