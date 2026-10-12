import { Button } from '@/components/ui/button';
import { Body, Label } from '@/components/ui/typography';
import { useSurfaces } from '@/theme/surfaces';
import { Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Fixed bottom bar with the form's primary action. */
export function FormFooter({
  label,
  onPress,
  loading,
  error,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  error?: string | null;
}) {
  const insets = useSafeAreaInsets();
  const { colors, surfaces } = useSurfaces();
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: Math.max(insets.bottom, 14) + 10,
        gap: 10,
        backgroundColor: colors.paper,
        borderTopWidth: surfaces.strongRule.width,
        borderTopColor: surfaces.strongRule.color,
      }}>
      {error ? (
        <Body size={14} color={colors.danger} accessibilityLiveRegion="polite">
          {error}
        </Body>
      ) : null}
      <Button label={label} onPress={onPress} loading={loading} />
    </View>
  );
}

/** Big bold number with a mono unit, used inside the two-column points card. */
export function BigNumberInput({
  label,
  value,
  onChange,
  onBlur,
  unit = 'pts',
  error,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  onBlur?: () => void;
  unit?: string;
  error?: string;
}) {
  const { colors } = useSurfaces();
  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 14, gap: 4 }}>
      <Label>{label}</Label>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <TextInput
          value={String(value)}
          onChangeText={(text) => onChange(Number(text.replace(/\D/g, '')) || 0)}
          onBlur={onBlur}
          keyboardType="number-pad"
          accessibilityLabel={label}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          maxLength={6}
          style={{
            minWidth: 44,
            maxWidth: 110,
            padding: 0,
            fontFamily: 'BricolageGrotesque_800ExtraBold',
            fontSize: 32,
            letterSpacing: -0.96,
            color: error ? colors.danger : colors.ink,
          }}
        />
        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 13, color: colors.mute }}>{unit}</Text>
      </View>
      {error ? (
        <Body size={13} color={colors.danger}>
          {error}
        </Body>
      ) : null}
    </View>
  );
}
