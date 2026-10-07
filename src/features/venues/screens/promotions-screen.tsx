import { CachedImage } from '@/components/cached-image';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader, ScreenHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { usePromotionFeed } from '@/features/venues/hooks';
import type { PromotionFeedItem } from '@/features/venues/schemas';
import { useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomerPromotionsScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const promotions = usePromotionFeed();
  const refreshControl = useListRefresh([promotions]);
  const rows = promotions.data ?? [];

  if (promotions.isPending) return <ScreenState loading skeleton="ticket" title="Loading promotions" />;
  if (promotions.isError) {
    return (
      <ScreenState
        title="Couldn’t load promotions"
        detail="Check your connection and try again."
        action="Try again"
        onPress={() => void promotions.refetch()}
      />
    );
  }

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <AppHeader />
      <FlatList
        style={{ flex: 1 }}
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: tabInset + 24, flexGrow: 1 }}
        refreshControl={refreshControl}
        ListHeaderComponent={
          <View className="mb-4">
            <ScreenHeader title="Promotions" subtitle="Offers shops have published for guests." />
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <PromotionCard promotion={item} onPress={() => router.push(`/(user)/venue/${item.venue.id}`)} />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-perks"
            title="No promotions yet"
            detail="When a shop publishes an offer, it will show up here."
          />
        }
      />
    </ScreenEnter>
  );
}

function PromotionCard({ promotion, onPress }: { promotion: PromotionFeedItem; onPress: () => void }) {
  return (
    <View className="mx-6 mb-4">
      <Card onPress={onPress}>
        {promotion.imageUrl ? (
          <CachedImage source={{ uri: promotion.imageUrl }} style={{ height: 160, width: '100%' }} contentFit="cover" />
        ) : null}
        <View className="px-5 py-4">
          {promotion.venue.category ? (
            <View className="mb-3 self-start">
              <Badge label={promotion.venue.category} tone="accent" />
            </View>
          ) : null}
          <Text className="font-display text-title text-haunt-ink">{promotion.title}</Text>
          <Text className="mt-1 font-sans text-caption text-haunt-mute">{promotion.venue.name}</Text>
          {promotion.description ? (
            <Text className="mt-3 font-sans text-body text-haunt-ink">{promotion.description}</Text>
          ) : null}
        </View>
      </Card>
    </View>
  );
}
