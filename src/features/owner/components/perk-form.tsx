import { Chip } from '@/components/ui/chip';
import { hapticLight } from '@/components/ui/press';
import { PrimaryButton } from '@/features/auth/components/primary-button';
import { TextField } from '@/features/auth/components/text-field';
import { FormSection } from '@/features/owner/components/form-section';
import { ImageField } from '@/features/owner/components/image-field';
import { PerkPreview } from '@/features/owner/components/perk-preview';
import { useSavePerk } from '@/features/owner/hooks';
import { perkFormSchema, type OwnerPerk, type OwnerVenue, type PerkFormValues } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useHauntColors } from '@/theme/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gift, Percent, UtensilsCrossed } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const types = [
  { id: 'DISCOUNT', label: 'Discount', icon: Percent },
  { id: 'FREE_MEAL', label: 'Free meal', icon: UtensilsCrossed },
  { id: 'OTHER', label: 'Gift', icon: Gift },
] as const;

type PerkFormProps = {
  perk?: OwnerPerk | null;
  venues: OwnerVenue[];
  onSaved: (perk: OwnerPerk) => void;
};

export function PerkForm({ perk, venues, onSaved }: PerkFormProps) {
  const insets = useSafeAreaInsets();
  const colors = useHauntColors();
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
  const preview = form.watch();
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
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 16, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <PerkPreview values={preview} venueName={venueName} />
        <FormSection title="Photo">
          <Controller
            control={form.control}
            name="imageUrl"
            render={({ field }) => <ImageField url={field.value} onChange={field.onChange} />}
          />
        </FormSection>
        <FormSection title="Details">
          {perk ? (
            <Text className="font-sans text-body text-haunt-mute">{perk.venue?.name ?? 'This place'}</Text>
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
                placeholder="Free drink"
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
                placeholder="Optional"
                autoCapitalize="sentences"
                multiline
              />
            )}
          />
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <View className="flex-row gap-2">
                {types.map((type) => {
                  const selected = field.value === type.id;
                  const Icon = type.icon;
                  return (
                    <Pressable
                      key={type.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => {
                        hapticLight();
                        field.onChange(type.id);
                      }}
                      className={`h-20 flex-1 items-center justify-center rounded-3xl ${selected ? 'bg-haunt-ink' : 'bg-haunt-paper'}`}>
                      <Icon color={selected ? colors.card : colors.ink} size={20} />
                      <Text className={`mt-1 font-sans-semibold text-caption ${selected ? 'text-haunt-card' : 'text-haunt-ink'}`}>
                        {type.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </FormSection>
        <FormSection title="Rewards">
          <Controller
            control={form.control}
            name="pointsRequired"
            render={({ field, fieldState }) => (
              <TextField
                label="Points required"
                value={String(field.value)}
                keyboardType="number-pad"
                onChangeText={(text) => field.onChange(Number(text.replace(/\D/g, '')) || 0)}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          {preview.type === 'DISCOUNT' ? (
            <Controller
              control={form.control}
              name="discountPercent"
              render={({ field, fieldState }) => (
                <TextField
                  label="Discount percent"
                  value={String(field.value)}
                  keyboardType="number-pad"
                  onChangeText={(text) => field.onChange(Number(text.replace(/\D/g, '')) || 0)}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          ) : null}
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
              />
            )}
          />
        </FormSection>
      </ScrollView>
      <View className="bg-haunt-paper px-6 pt-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        {formError ? <Text className="mb-3 font-sans text-caption text-haunt-danger">{formError}</Text> : null}
        <PrimaryButton label={perk ? 'Save perk' : 'Create perk'} onPress={() => void onSubmit()} loading={save.isPending} />
      </View>
    </KeyboardAvoidingView>
  );
}
