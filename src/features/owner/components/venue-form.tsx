import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { DashRule } from '@/components/ui/decor';
import { Body, Hand, Label } from '@/components/ui/typography';
import { TextField } from '@/features/auth/components/text-field';
import { BigNumberInput, FormFooter } from '@/features/owner/components/form-parts';
import { FormSection } from '@/features/owner/components/form-section';
import { ImageField } from '@/features/owner/components/image-field';
import { PinPicker } from '@/features/owner/components/pin-picker';
import { RadiusSlider } from '@/features/owner/components/radius-slider';
import { useSaveVenue } from '@/features/owner/hooks';
import { venueFormSchema, type OwnerVenue, type VenueFormValues } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

const categories = ['Restaurant', 'Bar', 'Cafe', 'Pub', 'Lounge', 'Other'] as const;
const categoryLabel: Record<(typeof categories)[number], string> = {
  Restaurant: 'Restaurant',
  Bar: 'Bar',
  Cafe: 'Café',
  Pub: 'Pub',
  Lounge: 'Lounge',
  Other: 'Something else',
};

type VenueFormProps = {
  venue?: OwnerVenue | null;
  origin?: { lat: number; lng: number } | null;
  onSaved: (venue: OwnerVenue) => void;
};

export function VenueForm({ venue, origin, onSaved }: VenueFormProps) {
  const { colors, isJournal } = useSurfaces();
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 30, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>
        <Controller
          control={form.control}
          name="imageUrl"
          render={({ field }) => <ImageField url={field.value} onChange={field.onChange} />}
        />
        <FormSection step="01" title="The basics">
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
                placeholder="What’s on the sign outside"
                autoCapitalize="words"
                displaySize={20}
              />
            )}
          />
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <View style={{ gap: 8 }}>
                <Label>Kind of place</Label>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={categoryLabel[category]}
                      selected={field.value === category}
                      onPress={() => field.onChange(category)}
                    />
                  ))}
                </View>
                {fieldState.error ? (
                  <Body size={13} color={colors.danger}>
                    {fieldState.error.message}
                  </Body>
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
                label="A line for guests"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Cold beer, a sea breeze and a quiz every Thursday."
                autoCapitalize="sentences"
                multiline
              />
            )}
          />
        </FormSection>
        <FormSection
          step="02"
          title="Where it counts"
          hint="Drag the pin to your door. Guests have to be inside the circle for a visit to count."
          gap={14}>
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
                    render={({ field: radiusField, fieldState }) => (
                      <View style={{ gap: 18 }}>
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
                        {fieldState.error ? (
                          <Body size={13} color={colors.danger}>
                            {fieldState.error.message}
                          </Body>
                        ) : null}
                      </View>
                    )}
                  />
                )}
              />
            )}
          />
        </FormSection>
        <FormSection step="03" title="What a visit earns" gap={14}>
          <Card style={{ flexDirection: 'row' }}>
            <Controller
              control={form.control}
              name="pointsPerPhoto"
              render={({ field, fieldState }) => (
                <BigNumberInput
                  label="Per photo"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <DashRule vertical color={colors.lineStrong} width={isJournal ? 1.5 : 1} />
            <Controller
              control={form.control}
              name="pointsPerVideo"
              render={({ field, fieldState }) => (
                <BigNumberInput
                  label="Per video"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          </Card>
          <Hand>videos take more effort, so they’re worth more</Hand>
        </FormSection>
      </ScrollView>
      <FormFooter
        label={venue ? 'Save place' : 'Add place'}
        onPress={() => void onSubmit()}
        loading={save.isPending}
        error={formError}
      />
    </KeyboardAvoidingView>
  );
}
