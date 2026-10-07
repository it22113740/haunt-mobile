import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="rounded-3xl bg-haunt-card p-5 shadow-card" style={{ elevation: 4 }}>
      <Text className="mb-4 font-display text-title text-haunt-ink">{title}</Text>
      <View className="gap-4">{children}</View>
    </View>
  );
}
