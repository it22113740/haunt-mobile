import { CachedImage } from '@/components/cached-image';
import { Badge } from '@/components/ui/badge';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { PointsPill } from '@/components/ui/points-pill';
import { useVenuePerks } from '@/features/venues/hooks';
import type { Perk } from '@/features/venues/schemas';
import type { VenuePoints } from '@/features/wallet/schemas';
import { Pressable, Text, View } from 'react-native';

const typeLabel = { DISCOUNT: 'Discount', FREE_MEAL: 'Free meal', OTHER: 'Perk' } as const;

export function VenueSpend({
  venue,
  open,
  onToggle,
  onRedeem,
  redeemingId,
}: {
  venue: VenuePoints;
  open: boolean;
  onToggle: () => void;
  onRedeem: (perkId: string) => void;
  redeemingId: string | null;
}) {
  const perks = useVenuePerks(venue.venueId);
  const cheapest = perks.data?.reduce<Perk | null>((best, perk) => {
    if (!best || perk.pointsRequired < best.pointsRequired) return perk;
    return best;
  }, null);
  const short = cheapest ? Math.max(cheapest.pointsRequired - venue.points, 0) : 0;
  const ratio = cheapest && cheapest.pointsRequired > 0 ? Math.min(1, venue.points / cheapest.pointsRequired) : 0;

  return (
    <View className="rounded-3xl bg-haunt-card p-5 shadow-card" style={{ elevation: 4 }}>
      <Text className="font-display text-title text-haunt-ink">{venue.venueName}</Text>
      <Text className="mt-1 font-display-extra text-display-lg text-haunt-ink">{venue.points}</Text>
      {cheapest ? (
        <>
          <Text className="mt-2 font-sans text-caption text-haunt-mute">
            {short > 0 ? `${short} more for ${cheapest.title}` : `Ready for ${cheapest.title}`}
          </Text>
          <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-haunt-blush">
            <View className="h-1.5 rounded-full bg-haunt-accent" style={{ width: `${Math.round(ratio * 100)}%` }} />
          </View>
        </>
      ) : null}
      <View className="mt-4">
        <Button size="md" label="Redeem" onPress={onToggle} />
      </View>
      <BottomSheet visible={open} onClose={onToggle}>
        <Text className="font-display text-title text-haunt-ink">{venue.venueName}</Text>
        <PerkChoices
          points={venue.points}
          perks={perks.data}
          pending={perks.isPending}
          error={perks.isError}
          onRetry={() => void perks.refetch()}
          redeemingId={redeemingId}
          onRedeem={onRedeem}
        />
      </BottomSheet>
    </View>
  );
}

function PerkChoices({
  points,
  perks,
  pending,
  error,
  onRetry,
  redeemingId,
  onRedeem,
}: {
  points: number;
  perks?: Perk[];
  pending: boolean;
  error: boolean;
  onRetry: () => void;
  redeemingId: string | null;
  onRedeem: (perkId: string) => void;
}) {
  if (pending) return <Text className="mt-4 font-sans text-caption text-haunt-mute">Loading perks…</Text>;
  if (error) {
    return (
      <Pressable onPress={onRetry} className="mt-4">
        <Text className="font-sans-semibold text-body text-haunt-accent">Couldn’t load perks. Try again.</Text>
      </Pressable>
    );
  }
  if (!perks?.length) return <Text className="mt-4 font-sans text-caption text-haunt-mute">No perks at this venue.</Text>;

  return (
    <View className="mt-4 gap-3">
      {perks.map((perk) => {
        const missing = Math.max(perk.pointsRequired - points, 0);
        return (
          <View key={perk.id} className={`flex-row items-center ${missing > 0 ? 'opacity-50' : ''}`}>
            {perk.imageUrl ? (
              <CachedImage source={{ uri: perk.imageUrl }} style={{ width: 56, height: 56, borderRadius: 16 }} contentFit="cover" />
            ) : (
              <View className="h-14 w-14 rounded-2xl bg-haunt-blush" />
            )}
            <View className="ml-3 flex-1">
              <Badge label={typeLabel[perk.type]} tone="accent" />
              <Text className="mt-1 font-sans-semibold text-body text-haunt-ink">{perk.title}</Text>
              <View className="mt-1">
                <PointsPill value={`${perk.pointsRequired} pts`} />
              </View>
            </View>
            <View className="ml-2">
              {missing > 0 ? (
                <Text className="font-sans-semibold text-caption text-haunt-mute">Need {missing} more</Text>
              ) : (
                <Button size="sm" label="Redeem" loading={redeemingId === perk.id} onPress={() => onRedeem(perk.id)} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
