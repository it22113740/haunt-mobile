import { Text, View } from 'react-native';

type BadgeTone = 'good' | 'danger' | 'warn' | 'neutral' | 'accent';

const tones: Record<BadgeTone, { chip: string; label: string }> = {
  good: { chip: 'bg-haunt-goodSoft', label: 'text-haunt-good' },
  danger: { chip: 'bg-haunt-dangerSoft', label: 'text-haunt-danger' },
  warn: { chip: 'bg-haunt-blush', label: 'text-haunt-accent' },
  neutral: { chip: 'bg-haunt-line', label: 'text-haunt-ink' },
  accent: { chip: 'bg-haunt-blush', label: 'text-haunt-accent' },
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  const colors = tones[tone];
  return (
    <View className={`rounded-full px-3 py-1 ${colors.chip}`}>
      <Text className={`font-sans-semibold text-caption ${colors.label}`}>{label}</Text>
    </View>
  );
}
