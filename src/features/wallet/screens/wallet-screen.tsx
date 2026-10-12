import { PressScale } from '@/components/ui/press-scale';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Card } from '@/components/ui/card';
import { DashRule, Doodle, Stamp } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { hapticLight, hapticSuccess } from '@/components/ui/press';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { Body, Label, Mono, ScribbleCircle, Sub } from '@/components/ui/typography';
import { PromoModal } from '@/features/wallet/components/promo-modal';
import { VenueSpend } from '@/features/wallet/components/venue-spend';
import { useMyPoints, useMyRedemptions, useRedeemPerk } from '@/features/wallet/hooks';
import type { Redemption } from '@/features/wallet/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { monthDay } from '@/lib/dates';
import { useSurfaces } from '@/theme/surfaces';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function WalletScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const { colors, isWhite } = useSurfaces();
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
  const total = balance?.total ?? 0;
  const spent = redemptions.reduce((sum, item) => sum + item.pointsSpent, 0);
  const allUsed = redemptions.length > 0 && redemptions.every((item) => item.status === 'USED');

  const totalText = (
    <Text
      style={{
        fontFamily: 'BricolageGrotesque_800ExtraBold',
        fontSize: 64,
        lineHeight: 64,
        letterSpacing: -3.2,
        color: colors.ink,
      }}>
      {total}
    </Text>
  );

  return (
    <ScreenEnter className="flex-1 bg-hunt-paper" style={{ paddingTop: insets.top }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: tabInset, gap: 24 }}
        refreshControl={refreshControl}>
        <AppHeader title="Wallet" />

        <Card
          tone={isWhite ? 'card' : 'raised'}
          style={{ padding: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}
          accessibilityLabel={`${total} points to spend`}>
          {isWhite ? <Doodle kind="sparkle" size={18} accent style={{ right: 12, top: 8 }} /> : null}
          <View style={{ gap: 2 }}>
            <Label>Points to spend</Label>
            {isWhite ? <ScribbleCircle style={{ marginTop: 8 }}>{totalText}</ScribbleCircle> : totalText}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Mono size={12} style={{ lineHeight: 20 }}>{`${total + spent} earned`}</Mono>
            <Mono size={12} style={{ lineHeight: 20 }}>{`${spent} spent`}</Mono>
            <Mono size={12} style={{ lineHeight: 20 }}>{`${venueCount} ${venueCount === 1 ? 'place' : 'places'}`}</Mono>
          </View>
        </Card>

        <View style={{ gap: 10 }}>
          <Label>By place</Label>
          {balance && balance.byVenue.length > 0 ? (
            <View style={{ gap: 10 }}>
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
                        onError: (redeemError) =>
                          setError(getApiErrorMessage(redeemError, 'Could not redeem this perk.')),
                      });
                    }}
                  />
                </ListEnter>
              ))}
            </View>
          ) : (
            <Sub>Submit a visit and get it approved to start a balance.</Sub>
          )}
          {error ? (
            <Body size={14} color={colors.danger} accessibilityLiveRegion="polite">
              {error}
            </Body>
          ) : null}
        </View>

        <View style={{ gap: 10 }}>
          <Label>{allUsed ? 'Used codes' : 'Your codes'}</Label>
          {redemptions.length === 0 ? (
            <EmptyState
              illustration="empty-wallet"
              title="No codes yet"
              detail="Swap points for a perk and the code shows up here."
            />
          ) : (
            <View style={{ gap: 10 }}>
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

        {isWhite ? (
          <View style={{ height: 90 }}>
            <Doodle kind="mug" size={46} rotate={-6} style={{ left: 14, top: 0 }} />
            <Doodle kind="ticket" size={70} rotate={8} style={{ left: '38%', top: 26 }} />
            <Doodle kind="sparkle" size={20} accent style={{ right: 60, top: 6 }} />
            <Doodle kind="squiggle" size={90} rotate={-3} style={{ right: 10, top: 66 }} />
          </View>
        ) : null}
      </ScrollView>
      <PromoModal redemption={issued} onClose={() => setIssued(null)} />
    </ScreenEnter>
  );
}

function HistoryRow({ item, onPress }: { item: Redemption; onPress: () => void }) {
  const { colors, surfaces, isJournal } = useSurfaces();
  const used = item.status === 'USED';
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={`${item.perk.title} at ${item.perk.venue.name}, code ${item.promoCode}, ${used ? 'used' : 'ready to use'}`}
      onPress={onPress}
      style={[
        surfaces.soft,
        { flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden' },
      ]}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 14, gap: 4 }}>
        <Body size={16} weight="bold" numberOfLines={1}>
          {item.perk.title}
        </Body>
        <Body size={13} color={colors.mute} numberOfLines={1}>
          {`${item.perk.venue.name} · ${monthDay(item.createdAt)}`}
        </Body>
      </View>
      <DashRule vertical width={isJournal ? 1.5 : 1} />
      <View style={{ paddingHorizontal: 16, paddingVertical: 14, justifyContent: 'center', alignItems: 'flex-end', gap: 6 }}>
        <Mono
          size={12}
          color={used ? colors.mute : colors.ink}
          style={used ? { textDecorationLine: 'line-through' } : undefined}>
          {item.promoCode}
        </Mono>
        <Stamp label={used ? 'Used' : 'Ready'} tone={used ? 'used' : 'wait'} rotate={-4} />
      </View>
    </PressScale>
  );
}
