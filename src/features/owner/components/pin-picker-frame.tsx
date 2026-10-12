import { Card } from '@/components/ui/card';
import { Body, Mono } from '@/components/ui/typography';
import { TextField } from '@/features/auth/components/text-field';
import { formatCoords } from '@/features/venues/components/map-style';
import { useSurfaces } from '@/theme/surfaces';
import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

export type PinPickerProps = {
  lat: number;
  lng: number;
  radiusMeters: number;
  onChange: (pin: { lat: number; lng: number }) => void;
};

function parseCoord(text: string) {
  if (!/^-?\d*\.?\d*$/.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

/** Map card with the coordinate footer and the optional typed-coordinates fields. */
export function PinPickerFrame({
  lat,
  lng,
  onChange,
  typedByDefault = false,
  children,
}: Omit<PinPickerProps, 'radiusMeters'> & { typedByDefault?: boolean; children: ReactNode }) {
  const { colors, isJournal } = useSurfaces();
  const [typing, setTyping] = useState(typedByDefault);
  const [latText, setLatText] = useState(String(lat));
  const [lngText, setLngText] = useState(String(lng));
  const [synced, setSynced] = useState({ lat, lng });

  if (synced.lat !== lat || synced.lng !== lng) {
    setSynced({ lat, lng });
    if (Number(latText) !== lat) setLatText(String(lat));
    if (Number(lngText) !== lng) setLngText(String(lng));
  }

  return (
    <View style={{ gap: 18 }}>
      <Card>
        {children}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderTopWidth: isJournal ? 1.5 : 1,
            borderTopColor: isJournal ? colors.ink : colors.line,
          }}>
          <Mono size={12} numberOfLines={1} style={{ flexShrink: 1 }}>
            {formatCoords(lat, lng)}
          </Mono>
          {typedByDefault ? null : (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: typing }}
              hitSlop={8}
              onPress={() => setTyping((current) => !current)}>
              <Body size={14} weight="bold" color={colors.accentDeep}>
                {typing ? 'Hide coordinates' : 'Type coordinates'}
              </Body>
            </Pressable>
          )}
        </View>
      </Card>
      {typing ? (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1 }}>
            <TextField
              label="Latitude"
              value={latText}
              mono
              keyboardType="numbers-and-punctuation"
              onChangeText={(text) => {
                setLatText(text);
                const next = parseCoord(text);
                if (next !== null && next >= -90 && next <= 90) onChange({ lat: next, lng });
              }}
              onBlur={() => setLatText(String(lat))}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label="Longitude"
              value={lngText}
              mono
              keyboardType="numbers-and-punctuation"
              onChangeText={(text) => {
                setLngText(text);
                const next = parseCoord(text);
                if (next !== null && next >= -180 && next <= 180) onChange({ lat, lng: next });
              }}
              onBlur={() => setLngText(String(lng))}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
