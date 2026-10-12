import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { DashRule, Rule, Ticks } from '@/components/ui/decor';
import { hapticLight } from '@/components/ui/press';
import { Body, H2, Hand, Label, Mono, ScribbleUnderline } from '@/components/ui/typography';
import { perkSubtitle } from '@/features/venues/components/perk-carousel';
import { useVenue, useVenuePerks } from '@/features/venues/hooks';
import type { Perk } from '@/features/venues/schemas';
import type { VenuePoints } from '@/features/wallet/schemas';
import { useSurfaces } from '@/theme/surfaces';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function shotsNote(missing: number, pointsPerPhoto?: number) {
  if (missing <= 0) return 'it’s yours, enjoy';
  if (!pointsPerPhoto) return 'a few more visits and it’s yours';
  const photos = Math.ceil(missing / pointsPerPhoto);
  const count = WORDS[photos] ?? String(photos);
  return `${count} more ${photos === 1 ? 'photo' : 'photos'} and it’s yours`;
}

function cheapestOf(perks?: Perk[]) {
  return perks?.reduce<Perk | null>((best, perk) => (!best || perk.pointsRequired < best.pointsRequired ? perk : best), null);
}

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
  const { colors, surfaces } = useSurfaces();
  const perks = useVenuePerks(venue.venueId);
  const cheapest = cheapestOf(perks.data);
  const short = cheapest ? Math.max(cheapest.pointsRequired - venue.points, 0) : 0;
  const ratio = cheapest && cheapest.pointsRequired > 0 ? Math.min(1, venue.points / cheapest.pointsRequired) : 0;

  return (
    <View style={[surfaces.soft, { padding: 16, gap: 14 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <Body size={18} weight="bold" style={{ flex: 1 }} numberOfLines={1}>
          {venue.venueName}
        </Body>
        <Mono size={15} medium color={colors.ink}>{`${venue.points} pts`}</Mono>
      </View>
      {cheapest ? (
        <View style={{ gap: 6 }}>
          <Ticks progress={ratio} />
          <Text style={{ fontFamily: 'BricolageGrotesque_400Regular', fontSize: 14, color: colors.mute }}>
            {short > 0 ? `${short} more for a ` : 'Enough for a '}
            <Text style={{ fontFamily: 'BricolageGrotesque_700Bold', color: colors.ink }}>{cheapest.title}</Text>
          </Text>
        </View>
      ) : null}
      <Button size="sm" variant="secondary" label="See perks" onPress={onToggle} />
      <BottomSheet visible={open} onClose={onToggle} accessibilityLabel={`Perks at ${venue.venueName}`}>
        <PerkSheet
          venue={venue}
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

function PerkSheet({
  venue,
  perks,
  pending,
  error,
  onRetry,
  redeemingId,
  onRedeem,
}: {
  venue: VenuePoints;
  perks?: Perk[];
  pending: boolean;
  error: boolean;
  onRetry: () => void;
  redeemingId: string | null;
  onRedeem: (perkId: string) => void;
}) {
  const { colors, isWhite } = useSurfaces();
  const details = useVenue(venue.venueId).venue;
  const affordable = perks?.find((perk) => perk.pointsRequired <= venue.points);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = perks?.find((perk) => perk.id === pickedId) ?? affordable ?? cheapestOf(perks) ?? null;
  const missing = picked ? Math.max(picked.pointsRequired - venue.points, 0) : 0;
  const note = shotsNote(missing, details?.pointsPerPhoto);

  return (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ gap: 4, flex: 1 }}>
          <Label>Spend at</Label>
          <H2 size={24} numberOfLines={1}>
            {venue.venueName}
          </H2>
        </View>
        <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 14, color: colors.ink }}>
          {'You have '}
          <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold' }}>{venue.points}</Text>
          {' pts'}
        </Text>
      </View>

      {pending ? <Body color={colors.mute}>Loading perks…</Body> : null}
      {error ? (
        <Pressable accessibilityRole="button" onPress={onRetry}>
          <Body weight="semibold" color={colors.accentDeep}>
            Couldn’t load perks. Tap to try again.
          </Body>
        </Pressable>
      ) : null}
      {!pending && !error && !perks?.length ? <Body color={colors.mute}>No perks at this place yet.</Body> : null}

      {perks?.length ? (
        <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
          {perks.map((perk) => (
            <PerkRow
              key={perk.id}
              perk={perk}
              points={venue.points}
              selected={picked?.id === perk.id}
              selectable={perks.length > 1}
              onPress={() => {
                hapticLight();
                setPickedId(perk.id);
              }}
            />
          ))}
        </View>
      ) : null}

      {picked ? (
        <View style={{ gap: 10, alignItems: 'center' }}>
          <Button
            className="self-stretch"
            label={missing > 0 ? `${missing} more points to go` : `Swap ${picked.pointsRequired} pts for a code`}
            disabled={missing > 0}
            loading={redeemingId === picked.id}
            onPress={() => onRedeem(picked.id)}
          />
          {isWhite ? (
            <ScribbleUnderline color={colors.accentDeep} style={{ alignSelf: 'center' }}>
              <Hand>{note}</Hand>
            </ScribbleUnderline>
          ) : (
            <Hand>{note}</Hand>
          )}
        </View>
      ) : null}

      <Rule />
      <Body size={13} color={colors.mute} style={{ lineHeight: 20 }}>
        When you swap points, you get a code. Show it at the bar and they’ll mark it used. Each code works once.
      </Body>
    </View>
  );
}

function PerkRow({
  perk,
  points,
  selected,
  selectable,
  onPress,
}: {
  perk: Perk;
  points: number;
  selected: boolean;
  selectable: boolean;
  onPress: () => void;
}) {
  const { colors, surfaces, isJournal } = useSurfaces();
  const ratio = perk.pointsRequired > 0 ? Math.min(1, points / perk.pointsRequired) : 1;
  return (
    <Pressable
      accessibilityRole={selectable ? 'radio' : undefined}
      accessibilityState={selectable ? { checked: selected } : undefined}
      accessibilityLabel={`${perk.title}, ${perk.pointsRequired} points`}
      disabled={!selectable}
      onPress={onPress}
      style={[
        surfaces.soft,
        { flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden' },
        selectable && selected ? { borderColor: isJournal ? colors.ink : colors.lineStrong, borderWidth: 1.5 } : null,
      ]}>
      <View style={{ flex: 1, padding: 16, gap: 10 }}>
        <View style={{ gap: 3 }}>
          <Body size={18} weight="bold">
            {perk.title}
          </Body>
          <Body size={14} color={colors.mute}>
            {perkSubtitle(perk)}
          </Body>
        </View>
        <Ticks progress={ratio} />
      </View>
      <DashRule vertical width={isJournal ? 1.5 : 1} />
      <View style={{ width: 96, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Body size={28} weight="extra" style={{ letterSpacing: -0.84, lineHeight: 32 }}>
          {perk.pointsRequired}
        </Body>
        <Mono size={11}>POINTS</Mono>
      </View>
    </Pressable>
  );
}
