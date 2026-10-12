import { BackHeader } from '@/components/ui/screen-header';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FormHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top + 18, paddingHorizontal: 20, paddingBottom: 6 }}>
      <BackHeader title={title} />
    </View>
  );
}
