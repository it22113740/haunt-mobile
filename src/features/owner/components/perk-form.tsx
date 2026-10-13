import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { DashRule } from '@/components/ui/decor';
import { Body, Hand, Label } from '@/components/ui/typography';
import { TextField } from '@/features/auth/components/text-field';
import { BigNumberInput, FormFooter } from '@/features/owner/components/form-parts';
import { FormSection } from '@/features/owner/components/form-section';
import { ImageField } from '@/features/owner/components/image-field';
import { PerkPreview } from '@/features/owner/components/perk-preview';
import { useSavePerk } from '@/features/owner/hooks';
import { perkFormSchema, type OwnerPerk, type OwnerVenue, type PerkFormValues } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';

const types = [
  { id: 'DISCOUNT', label: 'Discount' },
  { id: 'FREE_MEAL', label: 'Free meal' },
  { id: 'OTHER', label: 'Gift' },
] as const;

type PerkFormProps = {
  perk?: OwnerPerk | null;
  venues: OwnerVenue[];
  onSaved: (perk: OwnerPerk) => void;
};

export function PerkForm({ perk, venues, onSaved }: PerkFormProps) {
  const { colors, isJournal } = useSurfaces();
  const save = useSavePerk(perk?.id);
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<PerkFormValues>({
    resolver: zodResolver(perkFormSchema),
    defaultValues: {
      venueId: perk?.venueId ?? venues[0]?.id ?? '',
      title: perk?.title ?? '',
      description: perk?.description ?? '',
      pointsRequired: perk?.pointsRequired ?? 10,
      type: perk?.type ?? 'OTHER',
      discountPercent: perk?.discountPercent ?? 10,
      promoCodePrefix: perk?.promoCodePrefix ?? '',
      imageUrl: perk?.imageUrl ?? '',
    },
  });
  const [title, type, pointsRequired, discountPercent, imageUrl, venueId] = useWatch({
    control: form.control,
    name: ['title', 'type', 'pointsRequired', 'discountPercent', 'imageUrl', 'venueId'],
  });
  const preview = { title, type, pointsRequired, discountPercent, imageUrl, venueId };
  const venueName = perk?.venue?.name ?? venues.find((venue) => venue.id === preview.venueId)?.name;

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      onSaved(await save.mutateAsync(values));
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not save this perk.'));
    }
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 30, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>
        <Controller
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <ImageField
              url={field.value}
              onChange={field.onChange}
              label="Add a photo"
              hint="Optional. A photo of the perk helps it sell."
            />
          )}
        />
        <FormSection step="01" title="The perk">
          <View style={{ gap: 8 }}>
            <Label>For</Label>
            {perk ? (
              <View style={{ flexDirection: 'row' }}>
                <Chip label={perk.venue?.name ?? 'This place'} selected />
              </View>
            ) : (
              <Controller
                control={form.control}
                name="venueId"
                render={({ field, fieldState }) => (
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
                      <Body size={13} color={colors.danger}>
                        {fieldState.error.message}
                      </Body>
                    ) : null}
                  </View>
                )}
              />
            )}
          </View>
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
                placeholder="Sunset spritz"
                autoCapitalize="sentences"
                displaySize={20}
              />
            )}
          />
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <View style={{ gap: 8 }}>
                <Label>Kind of perk</Label>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {types.map((type) => (
                    <Chip
                      key={type.id}
                      label={type.label}
                      selected={field.value === type.id}
                      onPress={() => field.onChange(type.id)}
                    />
                  ))}
                </View>
              </View>
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <TextField
                label="The details"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Optional. Anything guests should know."
                autoCapitalize="sentences"
                multiline
              />
            )}
          />
        </FormSection>
        <FormSection step="02" title="What it costs" gap={14}>
          <Card style={{ flexDirection: 'row' }}>
            <Controller
              control={form.control}
              name="pointsRequired"
              render={({ field, fieldState }) => (
                <BigNumberInput
                  label="Points"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            {preview.type === 'DISCOUNT' ? (
              <>
                <DashRule vertical color={colors.lineStrong} width={isJournal ? 1.5 : 1} />
                <Controller
                  control={form.control}
                  name="discountPercent"
                  render={({ field, fieldState }) => (
                    <BigNumberInput
                      label="Discount"
                      unit="%"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </>
            ) : null}
          </Card>
          <Hand>a cheap first perk gets people coming back</Hand>
          <Controller
            control={form.control}
            name="promoCodePrefix"
            render={({ field }) => (
              <TextField
                label="Code prefix"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Optional, like BAR"
                autoCapitalize="characters"
                mono
              />
            )}
          />
        </FormSection>
        <View style={{ gap: 10 }}>
          <Label>Guests will see</Label>
          <PerkPreview values={preview} venueName={venueName} />
        </View>
      </ScrollView>
      <FormFooter
        label={perk ? 'Save perk' : 'Add perk'}
        onPress={() => void onSubmit()}
        loading={save.isPending}
        error={formError}
      />
    </KeyboardAvoidingView>
  );
}
