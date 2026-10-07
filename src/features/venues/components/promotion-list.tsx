import { CachedImage } from '@/components/cached-image';
import { EmptyState } from '@/components/empty-state';
import { SkeletonBlock } from '@/components/skeleton';
import type { Promotion } from '@/features/venues/schemas';
import { Pressable, Text, View } from 'react-native';

export function PromotionList({
  promotions,
  pending,
  error,
  onRetry,
}: {
  promotions?: Promotion[];
  pending: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  if (pending) return <SkeletonBlock height={96} radius={24} />;
  if (error) {
    return (
      <Pressable onPress={onRetry}>
        <Text className="font-sans-semibold text-body text-haunt-accent">Couldn’t load promotions. Try again.</Text>
      </Pressable>
    );
  }
  if (!promotions?.length) {
    return <EmptyState illustration="empty-perks" title="No promotions" detail="This place has nothing extra on right now." />;
  }

  return (
    <View className="gap-3">
      {promotions.map((promotion) => (
        <View key={promotion.id} className="overflow-hidden rounded-3xl bg-haunt-card shadow-card" style={{ elevation: 4 }}>
          {promotion.imageUrl ? (
            <CachedImage source={{ uri: promotion.imageUrl }} style={{ height: 140, width: '100%' }} contentFit="cover" />
          ) : null}
          <View className="px-5 py-4">
            <Text className="font-display text-body text-haunt-ink">{promotion.title}</Text>
            {promotion.description ? (
              <Text className="mt-2 font-sans text-caption text-haunt-mute">{promotion.description}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}
