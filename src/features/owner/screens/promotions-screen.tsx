import { CachedImage } from '@/components/cached-image';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { ActionMenu } from '@/components/ui/action-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashRule, Doodle, Tape } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { Body, H1, H2, Hand, Label, Sub } from '@/components/ui/typography';
import { AddTile } from '@/features/owner/components/add-tile';
import { useDeletePromotion, useMyPromotions } from '@/features/owner/hooks';
import type { OwnerPromotion } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ideas = ['happy hour, 5 to 7', 'a new dish on the menu', 'live music on Friday'];

export function PromotionsScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const { colors } = useSurfaces();
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

  const addOffer = () => router.push('/(owner)/promotion/new');

  return (
    <ScreenEnter className="flex-1 bg-hunt-paper" style={{ paddingTop: insets.top }}>
      <FlatList
        style={{ flex: 1 }}
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: tabInset, flexGrow: 1 }}
        refreshControl={refreshControl}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListHeaderComponent={
          <View style={{ gap: 8, marginBottom: 18 }}>
            <H1 size={28} accessibilityRole="header">
              Offers
            </H1>
            <Sub>Short notes guests see on your place’s page.</Sub>
            {error ? (
              <Body size={14} color={colors.danger} style={{ marginTop: 6 }}>
                {error}
              </Body>
            ) : null}
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
        ListFooterComponent={
          rows.length > 0 ? (
            <View style={{ paddingTop: 18 }}>
              <AddTile label="Write another offer" onPress={addOffer} />
            </View>
          ) : null
        }
        ListEmptyComponent={<NothingPosted onWrite={addOffer} />}
      />
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

function NothingPosted({ onWrite }: { onWrite: () => void }) {
  const { colors, surfaces } = useSurfaces();
  return (
    <View style={{ flex: 1, minHeight: 520 }}>
      <Doodle kind="sparkle" size={20} accent style={{ right: 18, top: 6 }} />
      <Doodle kind="sparkle" size={11} style={{ right: 42, top: 30 }} />
      <View style={[surfaces.dashed, { marginTop: 40, paddingHorizontal: 22, paddingVertical: 28, gap: 16 }]}>
        <Tape rotate={-4} style={{ top: -12, left: 30 }} />
        <Label>Nothing posted yet</Label>
        <H2 size={24} style={{ lineHeight: 29 }}>
          Got something on this week?
        </H2>
        <View style={{ gap: 8 }}>
          {ideas.map((idea) => (
            <Hand key={idea} size={21} color={colors.mute}>
              {`— ${idea}`}
            </Hand>
          ))}
        </View>
        <View style={{ marginTop: 6 }}>
          <Button label="Write an offer" onPress={onWrite} />
        </View>
      </View>
      <View style={{ height: 160 }} pointerEvents="none">
        <Doodle kind="pencil" size={52} rotate={-10} style={{ left: 10, top: 70 }} />
        <Doodle kind="star" size={22} rotate={10} style={{ right: 44, top: 90 }} />
        <Doodle kind="squiggle" size={110} style={{ left: 100, top: 140 }} />
      </View>
    </View>
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
  const { isJournal } = useSurfaces();
  return (
    <View>
      <Card onPress={onEdit} accessibilityLabel={`${promotion.title}. Edit offer`}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 10, paddingRight: 64, minHeight: 56, justifyContent: 'center' }}>
          <Label numberOfLines={1}>{promotion.venue?.name ?? 'Your place'}</Label>
        </View>
        <DashRule width={isJournal ? 1.5 : 1} />
        {promotion.imageUrl ? (
          <CachedImage source={{ uri: promotion.imageUrl }} style={{ height: 150, width: '100%' }} contentFit="cover" />
        ) : null}
        <View style={{ padding: 16, gap: 8 }}>
          <H2 size={24} style={{ letterSpacing: -0.48 }}>
            {promotion.title}
          </H2>
          {promotion.description ? (
            <Body size={16} style={{ lineHeight: 23 }}>
              {promotion.description}
            </Body>
          ) : null}
        </View>
      </Card>
      <ActionMenu
        label={`${promotion.title} options`}
        onEdit={onEdit}
        onDelete={onDelete}
        style={{ position: 'absolute', top: 8, right: 12 }}
      />
    </View>
  );
}
