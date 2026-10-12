import { CachedImage } from '@/components/cached-image';
import { SkeletonBlock } from '@/components/skeleton';
import { Card } from '@/components/ui/card';
import { Body, Sub } from '@/components/ui/typography';
import type { Promotion } from '@/features/venues/schemas';
import { useSurfaces } from '@/theme/surfaces';
import { Pressable, View } from 'react-native';

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
  const { colors, isJournal } = useSurfaces();
  if (pending) return <SkeletonBlock height={72} radius={10} />;
  if (error) {
    return (
      <Pressable accessibilityRole="button" onPress={onRetry}>
        <Body size={15} weight="semibold" color={colors.accentDeep}>
          Couldn’t load offers. Tap to try again.
        </Body>
      </Pressable>
    );
  }
  if (!promotions?.length) {
    return <Sub>Nothing extra on right now. Check back on the weekend.</Sub>;
  }

  return (
    <View style={{ gap: 12 }}>
      {promotions.map((promotion) => (
        <Card key={promotion.id} tone="soft">
          {promotion.imageUrl ? (
            <View style={{ borderBottomWidth: isJournal ? 1 : 0, borderBottomColor: colors.line }}>
              <CachedImage source={{ uri: promotion.imageUrl }} style={{ height: 140, width: '100%' }} contentFit="cover" />
            </View>
          ) : null}
          <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 4 }}>
            <Body size={17} weight="bold">
              {promotion.title}
            </Body>
            {promotion.description ? <Sub size={14}>{promotion.description}</Sub> : null}
          </View>
        </Card>
      ))}
    </View>
  );
}
