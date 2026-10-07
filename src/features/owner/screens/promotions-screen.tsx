import { CachedImage } from '@/components/cached-image';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { ActionMenu } from '@/components/ui/action-menu';
import { Card } from '@/components/ui/card';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader, ScreenHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { AddFab } from '@/features/owner/components/add-fab';
import { useDeletePromotion, useMyPromotions } from '@/features/owner/hooks';
import type { OwnerPromotion } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function PromotionsScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const promotions = useMyPromotions();
  const remove = useDeletePromotion();
  const [pending, setPending] = useState<OwnerPromotion | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        contentContainerStyle={{ paddingBottom: tabInset + 72, flexGrow: 1 }}
        refreshControl={refreshControl}
        ListHeaderComponent={
          <View className="mb-4">
            <ScreenHeader title="Promotions" subtitle="Announcements guests see on your shops." />
            {error ? <Text className="mt-3 px-6 font-sans text-caption text-haunt-danger">{error}</Text> : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <PromotionRow
              promotion={item}
              onEdit={() => router.push(`/(owner)/promotion/${item.id}`)}
              onDelete={() => setPending(item)}
            />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-perks"
            title="No promotions yet"
            detail="Tell guests about a happy hour, a new dish, or a weekend offer."
            action="Add a promotion"
            onPress={() => router.push('/(owner)/promotion/new')}
          />
        }
      />
      {rows.length > 0 ? (
        <AddFab onPress={() => router.push('/(owner)/promotion/new')} bottom={Math.max(insets.bottom, 12) + 100} />
      ) : null}
      <ConfirmDialog
        visible={Boolean(pending)}
        title={`Delete ${pending?.title ?? 'this promotion'}?`}
        detail="Guests will no longer see it on your shop."
        confirmLabel="Delete promotion"
        tone="danger"
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          const id = pending.id;
          setPending(null);
          remove.mutate(id, {
            onError: (deleteError) => setError(getApiErrorMessage(deleteError, 'Could not delete this promotion.')),
          });
        }}
      />
    </ScreenEnter>
  );
}

function PromotionRow({
  promotion,
  onEdit,
  onDelete,
}: {
  promotion: OwnerPromotion;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View className="relative mx-6 mb-4">
      <Card onPress={onEdit}>
        <View className="flex-row">
          {promotion.imageUrl ? (
            <CachedImage source={{ uri: promotion.imageUrl }} style={{ width: 108, height: 120 }} contentFit="cover" />
          ) : (
            <View className="h-[120px] w-[108px] items-center justify-center bg-haunt-blush">
              <Text className="font-sans-semibold text-caption text-haunt-accent">Promo</Text>
            </View>
          )}
          <View className="flex-1 justify-center px-4 py-4 pr-12">
            <Text className="font-display text-body text-haunt-ink" numberOfLines={2}>
              {promotion.title}
            </Text>
            <Text className="mt-1 font-sans text-caption text-haunt-mute" numberOfLines={1}>
              {promotion.venue?.name ?? 'Your place'}
            </Text>
            {promotion.description ? (
              <Text className="mt-2 font-sans text-caption text-haunt-ink" numberOfLines={2}>
                {promotion.description}
              </Text>
            ) : null}
          </View>
        </View>
      </Card>
      <View className="absolute right-3 top-3">
        <ActionMenu onEdit={onEdit} onDelete={onDelete} />
      </View>
    </View>
  );
}
