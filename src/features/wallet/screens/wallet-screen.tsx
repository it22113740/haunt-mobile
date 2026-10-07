import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Badge } from '@/components/ui/badge';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { hapticLight, hapticSuccess } from '@/components/ui/press';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { PromoModal } from '@/features/wallet/components/promo-modal';
import { VenueSpend } from '@/features/wallet/components/venue-spend';
import { useMyPoints, useMyRedemptions, useRedeemPerk } from '@/features/wallet/hooks';
import type { Redemption } from '@/features/wallet/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useHauntColors } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function WalletScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const colors = useHauntColors();
  const points = useMyPoints();
  const history = useMyRedemptions();
  const redeem = useRedeemPerk();
  const [openVenue, setOpenVenue] = useState<string | null>(null);
  const [issued, setIssued] = useState<Redemption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refreshControl = useListRefresh([points, history]);

  if (points.isPending || history.isPending) return <ScreenState loading skeleton="ticket" title="Loading your points" />;

  if (points.isError || history.isError) {
    return (
      <ScreenState
        title="Couldn’t load your wallet"
        detail="Check your connection and try again."
        action="Try again"
        onPress={() => {
          void points.refetch();
          void history.refetch();
        }}
      />
    );
  }

  const balance = points.data;
  const redemptions = history.data ?? [];
  const venueCount = balance?.byVenue.length ?? 0;

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: tabInset + 24 }} refreshControl={refreshControl}>
        <AppHeader />
        <View className="px-6">
          <LinearGradient
            colors={[colors.accent, colors.accentDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24, overflow: 'hidden', padding: 24 }}>
            <View
              pointerEvents="none"
              style={{ position: 'absolute', right: -24, top: -36, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,252,248,0.14)' }}
            />
            <View
              pointerEvents="none"
              style={{ position: 'absolute', right: 36, bottom: -48, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,252,248,0.1)' }}
            />
            <Text className="font-display text-haunt-onAccent" style={{ fontSize: 48, lineHeight: 52 }}>
              {balance?.total ?? 0}
            </Text>
            <Text className="mt-2 font-sans text-body text-haunt-onAccent">
              points across {venueCount} {venueCount === 1 ? 'venue' : 'venues'}
            </Text>
          </LinearGradient>
          <Text className="mb-4 mt-8 font-display text-title text-haunt-ink">By venue</Text>
          {balance && balance.byVenue.length > 0 ? (
            <View className="gap-3">
              {balance.byVenue.map((venue, index) => (
                <ListEnter key={venue.venueId} index={index}>
                <VenueSpend
                  venue={venue}
                  open={openVenue === venue.venueId}
                  onToggle={() => setOpenVenue((current) => (current === venue.venueId ? null : venue.venueId))}
                  redeemingId={redeem.isPending ? (redeem.variables ?? null) : null}
                  onRedeem={(perkId) => {
                    setError(null);
                    redeem.mutate(perkId, {
                      onSuccess: (redemption) => {
                        hapticSuccess();
                        setIssued(redemption);
                        setOpenVenue(null);
                      },
                      onError: (redeemError) => setError(getApiErrorMessage(redeemError, 'Could not redeem this perk.')),
                    });
                  }}
                />
                </ListEnter>
              ))}
            </View>
          ) : (
            <Text className="font-sans text-body text-haunt-mute">Submit a visit and get it approved to start a balance.</Text>
          )}
          {error ? <Text className="mt-4 font-sans text-caption text-haunt-danger">{error}</Text> : null}
          <Text className="mb-4 mt-10 font-display text-title text-haunt-ink">History</Text>
          {redemptions.length === 0 ? (
            <EmptyState illustration="empty-wallet" title="No redemptions yet" detail="Redeemed perks will show up here." />
          ) : (
            <View className="gap-3">
              {redemptions.map((item, index) => (
                <ListEnter key={item.id} index={index}>
                  <HistoryRow
                    item={item}
                    onPress={() => {
                      hapticLight();
                      setIssued(item);
                    }}
                  />
                </ListEnter>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <PromoModal redemption={issued} onClose={() => setIssued(null)} />
    </ScreenEnter>
  );
}

function HistoryRow({ item, onPress }: { item: Redemption; onPress: () => void }) {
  const when = new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="rounded-3xl bg-haunt-card">
      <View className="px-5 pb-3 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-mono text-body text-haunt-ink">{item.promoCode}</Text>
          <Badge label={item.status} tone={item.status === 'USED' ? 'neutral' : 'accent'} />
        </View>
        <Text className="mt-2 font-sans-semibold text-body text-haunt-ink">{item.perk.title}</Text>
      </View>
      <View className="flex-row items-center">
        <View className="-ml-3 h-6 w-6 rounded-full bg-haunt-paper" />
        <View className="mx-2 h-px flex-1 border-t border-dashed border-haunt-line" />
        <View className="-mr-3 h-6 w-6 rounded-full bg-haunt-paper" />
      </View>
      <Text className="px-5 pb-4 pt-3 font-sans text-caption text-haunt-mute">
        {item.perk.venue.name} · {when}
      </Text>
    </Pressable>
  );
}
