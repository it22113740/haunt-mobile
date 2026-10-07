import { Illustration, type IllustrationName } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  detail?: string;
  action?: string;
  onPress?: () => void;
  illustration?: IllustrationName;
};

export function EmptyState({ title, detail, action, onPress, illustration = 'onb-discover' }: EmptyStateProps) {
  return (
    <View className="items-center px-8 py-16">
      <Illustration name={illustration} size={180} />
      <Text className="mt-6 text-center font-display text-title text-haunt-ink">{title}</Text>
      {detail ? <Text className="mt-3 text-center font-sans text-body text-haunt-mute">{detail}</Text> : null}
      {action && onPress ? (
        <View className="mt-6">
          <Button label={action} onPress={onPress} />
        </View>
      ) : null}
    </View>
  );
}
