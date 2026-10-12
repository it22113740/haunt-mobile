import { H2, Sub } from '@/components/ui/typography';
import { useSurfaces } from '@/theme/surfaces';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

/** Numbered form step: `01  The basics`. */
export function FormSection({
  step,
  title,
  hint,
  gap = 22,
  children,
}: {
  step?: string;
  title: string;
  hint?: string;
  gap?: number;
  children: ReactNode;
}) {
  const { colors } = useSurfaces();
  return (
    <View style={{ gap }}>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
          {step ? (
            <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 13, color: colors.accentDeep }}>{step}</Text>
          ) : null}
          <H2 accessibilityRole="header">{title}</H2>
        </View>
        {hint ? <Sub size={14}>{hint}</Sub> : null}
      </View>
      {children}
    </View>
  );
}
