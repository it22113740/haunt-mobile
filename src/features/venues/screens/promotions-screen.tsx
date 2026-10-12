import { CachedImage } from '@/components/cached-image';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Card } from '@/components/ui/card';
import { DashRule, Doodle, Stamp, Tape } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { Body, H2, Hand, Label, Mono, Sub } from '@/components/ui/typography';
import { usePromotionFeed, useVenue } from '@/features/venues/hooks';
import type { PromotionFeedItem } from '@/features/venues/schemas';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, View } from 'react-native';
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
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top }}>
      <FlatList
        style={{ flex: 1 }}
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: tabInset, flexGrow: 1 }}
        refreshControl={refreshControl}
        ItemSeparatorComponent={() => <View style={{ height: 28 }} />}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 32 }}>
            <AppHeader title="Offers" />
            <Sub>What places around you are running right now.</Sub>
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <PromotionCard promotion={item} onPress={() => router.push(`/(user)/venue/${item.venue.id}`)} />
          </ListEnter>
        )}
        ListFooterComponent={rows.length > 0 ? <EndOfList /> : null}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-perks"
            title="No offers yet"
            detail="When a place posts an offer, it shows up here."
          />
        }
      />
    </ScreenEnter>
  );
}

function EndOfList() {
  const { colors, isJournal } = useSurfaces();
  return (
    <View style={{ paddingTop: 34 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <DashRule width={isJournal ? 1.5 : 1} style={{ flex: 1 }} />
        <Hand color={colors.mute}>that’s all for now</Hand>
        <DashRule width={isJournal ? 1.5 : 1} style={{ flex: 1 }} />
      </View>
      <View style={{ height: 210 }}>
        <Doodle kind="cocktail" size={48} rotate={-10} style={{ left: 26, top: 22 }} />
        <Doodle kind="sparkle" size={18} accent style={{ left: 142, top: 24 }} />
        <Doodle kind="sun" size={58} style={{ right: 30, top: 4 }} />
        <Doodle kind="trail" size={200} style={{ left: 70, top: 112 }} />
        <Doodle kind="heart" size={26} rotate={12} style={{ right: 60, top: 180 }} />
      </View>
    </View>
  );
}

function PromotionCard({ promotion, onPress }: { promotion: PromotionFeedItem; onPress: () => void }) {
  const { colors, isJournal } = useSurfaces();
  const address = useVenue(promotion.venue.id).venue?.address;
  const tag = [promotion.venue.name, promotion.venue.category].filter(Boolean).join(' · ');

  return (
    <View>
      <Card
        tone={isJournal ? 'raised' : 'card'}
        style={{ overflow: 'hidden' }}
        onPress={onPress}
        accessibilityLabel={`${promotion.title} at ${promotion.venue.name}. See the place`}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}>
          <Label style={{ flex: 1 }} numberOfLines={1}>
            {tag}
          </Label>
          <Stamp label="On now" tone="wait" rotate={-3} />
        </View>
        <DashRule width={isJournal ? 1.5 : 1} />
        {promotion.imageUrl ? (
          <CachedImage
            source={{ uri: promotion.imageUrl }}
            style={{ height: 160, width: '100%' }}
            contentFit="cover"
            accessibilityLabel={promotion.title}
          />
        ) : null}
        <View style={{ padding: 16, gap: 8 }}>
          <H2 size={26} style={{ letterSpacing: -0.52 }}>
            {promotion.title}
          </H2>
          {promotion.description ? (
            <Body size={16} style={{ lineHeight: 23 }}>
              {promotion.description}
            </Body>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: colors.line,
          }}>
          <Mono size={12} style={{ flex: 1 }} numberOfLines={1}>
            {address ?? promotion.venue.name}
          </Mono>
          <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8}>
            <Body size={14} weight="bold" color={colors.accentDeep} style={{ textDecorationLine: 'underline' }}>
              See the place
            </Body>
          </Pressable>
        </View>
      </Card>
      <Tape rotate={-5} style={{ top: -11, left: 24 }} />
      <Tape ash rotate={6} style={{ top: -11, right: 24 }} />
    </View>
  );
}
