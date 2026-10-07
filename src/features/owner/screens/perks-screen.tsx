import { CachedImage } from '@/components/cached-image';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { ActionMenu } from '@/components/ui/action-menu';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PointsPill } from '@/components/ui/points-pill';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader, ScreenHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { AddFab } from '@/features/owner/components/add-fab';
import { useDeletePerk, useMyPerks } from '@/features/owner/hooks';
import type { OwnerPerk } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const typeLabel = { DISCOUNT: 'Discount', FREE_MEAL: 'Free meal', OTHER: 'Gift' };

export function PerksScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const perks = useMyPerks();
  const remove = useDeletePerk();
  const [pending, setPending] = useState<OwnerPerk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refreshControl = useListRefresh([perks]);
  const rows = perks.data ?? [];

  if (perks.isPending) return <ScreenState loading skeleton="ticket" title="Loading perks" />;
  if (perks.isError) {
    return (
      <ScreenState
        title="Couldn’t load perks"
        detail="Check your connection and try again."
        action="Try again"
        onPress={() => void perks.refetch()}
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
            <ScreenHeader title="Perks" subtitle="What guests can spend their points on." />
            {error ? <Text className="mt-3 px-6 font-sans text-caption text-haunt-danger">{error}</Text> : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <PerkTicket
              perk={item}
              onEdit={() => router.push(`/(owner)/perk/${item.id}`)}
              onDelete={() => setPending(item)}
            />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-perks"
            title="No perks yet"
            detail="Add an offer guests can redeem with their points."
            action="Add a perk"
            onPress={() => router.push('/(owner)/perk/new')}
          />
        }
      />
      {rows.length > 0 ? <AddFab onPress={() => router.push('/(owner)/perk/new')} bottom={Math.max(insets.bottom, 12) + 100} /> : null}
      <ConfirmDialog
        visible={Boolean(pending)}
        title={`Delete ${pending?.title ?? 'this perk'}?`}
        detail="Guests will no longer be able to redeem it."
        confirmLabel="Delete perk"
        tone="danger"
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          const id = pending.id;
          setPending(null);
          remove.mutate(id, {
            onError: (deleteError) => setError(getApiErrorMessage(deleteError, 'Could not delete this perk.')),
          });
        }}
      />
    </ScreenEnter>
  );
}

function PerkTicket({ perk, onEdit, onDelete }: { perk: OwnerPerk; onEdit: () => void; onDelete: () => void }) {
  return (
    <View className="relative mx-6 mb-4">
      <Card onPress={onEdit}>
        <View className="flex-row">
          {perk.imageUrl ? (
            <CachedImage source={{ uri: perk.imageUrl }} style={{ width: 108, height: 132 }} contentFit="cover" />
          ) : (
            <View className="h-[132px] w-[108px] items-center justify-center bg-haunt-blush">
              <Text className="font-sans-semibold text-caption text-haunt-accent">{typeLabel[perk.type]}</Text>
            </View>
          )}
          <View className="flex-1 justify-center px-4 py-4 pr-12">
            <Badge label={typeLabel[perk.type]} tone="accent" />
            <Text className="mt-2 font-display text-body text-haunt-ink" numberOfLines={2}>
              {perk.title}
            </Text>
            <Text className="mt-1 font-sans text-caption text-haunt-mute" numberOfLines={1}>
              {perk.venue?.name ?? 'Your place'}
            </Text>
            <View className="mt-2 flex-row flex-wrap items-center gap-2">
              <PointsPill value={perk.pointsRequired} />
              {perk.type === 'DISCOUNT' && perk.discountPercent != null ? (
                <Text className="font-display text-caption text-haunt-accent">{perk.discountPercent}% OFF</Text>
              ) : null}
            </View>
          </View>
        </View>
      </Card>
      <View className="absolute right-3 top-3">
        <ActionMenu onEdit={onEdit} onDelete={onDelete} />
      </View>
    </View>
  );
}
