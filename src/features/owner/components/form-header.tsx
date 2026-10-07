import { BackButton } from '@/components/ui/icon-button';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FormHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-row items-center px-4" style={{ paddingTop: insets.top + 8 }}>
      <BackButton />
      <Text className="ml-3 font-display text-title text-haunt-ink">{title}</Text>
    </View>
  );
}
