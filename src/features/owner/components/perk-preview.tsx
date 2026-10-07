import { CachedImage } from '@/components/cached-image';
import { Badge } from '@/components/ui/badge';
import { PointsPill } from '@/components/ui/points-pill';
import type { PerkFormValues } from '@/features/owner/schemas';
import { Text, View } from 'react-native';

const typeLabel = { DISCOUNT: 'Discount', FREE_MEAL: 'Free meal', OTHER: 'Offer' };

export function PerkPreview({
  values,
  venueName,
}: {
  values: Pick<PerkFormValues, 'title' | 'type' | 'pointsRequired' | 'discountPercent' | 'imageUrl'>;
  venueName?: string;
}) {
  const title = values.title.trim() || 'Perk title';
  return (
    <View className="overflow-hidden rounded-3xl bg-haunt-card shadow-card" style={{ elevation: 4 }}>
      <View className="flex-row">
        {values.imageUrl ? (
          <CachedImage source={{ uri: values.imageUrl }} style={{ width: 112, height: 128 }} contentFit="cover" />
        ) : (
          <View className="h-32 w-28 items-center justify-center bg-haunt-blush">
            <Text className="font-sans-semibold text-caption text-haunt-accent">{typeLabel[values.type]}</Text>
          </View>
        )}
        <View className="flex-1 justify-center px-4 py-4">
          <Badge label={typeLabel[values.type]} tone="accent" />
          <Text className="mt-2 font-display text-body text-haunt-ink" numberOfLines={2}>
            {title}
          </Text>
          <Text className="mt-1 font-sans text-caption text-haunt-mute" numberOfLines={1}>
            {venueName || 'Your place'}
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <PointsPill value={values.pointsRequired || 0} />
            {values.type === 'DISCOUNT' && values.discountPercent > 0 ? (
              <Text className="font-display text-body text-haunt-accent">{values.discountPercent}% OFF</Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
