import { CachedImage } from '@/components/cached-image';
import { Card } from '@/components/ui/card';
import { Placeholder, Ticks } from '@/components/ui/decor';
import { ListEnter } from '@/components/ui/enter';
import { GlassIcon } from '@/components/ui/hunt-icons';
import { Body, Hand, Mono, Pts } from '@/components/ui/typography';
import type { Perk } from '@/features/venues/schemas';
import { useSurfaces } from '@/theme/surfaces';
import { View } from 'react-native';

export const perkTypeLabel = { DISCOUNT: 'Discount', FREE_MEAL: 'Free meal', OTHER: 'Perk' } as const;

export function perkSubtitle(perk: Pick<Perk, 'type' | 'discountPercent'>) {
  if (perk.type === 'DISCOUNT' && perk.discountPercent) return `${perk.discountPercent}% off`;
  return perkTypeLabel[perk.type];
}

/** "3 photos to go" — how many more approved photos close the gap. */
export function photosToGo(remaining: number, pointsPerPhoto: number) {
  if (remaining <= 0) return 'ready to swap';
  if (pointsPerPhoto <= 0) return `${remaining} pts to go`;
  const photos = Math.ceil(remaining / pointsPerPhoto);
  return `${photos} ${photos === 1 ? 'photo' : 'photos'} to go`;
}

export function PerkCarousel({
  perks,
  points,
  pointsPerPhoto,
}: {
  perks: Perk[];
  points: number;
  pointsPerPhoto: number;
}) {
  return (
    <View style={{ gap: 12 }}>
      {perks.map((perk, index) => (
        <ListEnter key={perk.id} index={index}>
          <PerkCard perk={perk} points={points} pointsPerPhoto={pointsPerPhoto} />
        </ListEnter>
      ))}
    </View>
  );
}

function PerkCard({ perk, points, pointsPerPhoto }: { perk: Perk; points: number; pointsPerPhoto: number }) {
  const { colors, surfaces } = useSurfaces();
  const ratio = perk.pointsRequired > 0 ? Math.min(1, points / perk.pointsRequired) : 1;
  const shown = Math.min(points, perk.pointsRequired);

  return (
    <Card style={{ padding: 16, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        {perk.imageUrl ? (
          <View style={[surfaces.image, { width: 56, height: 56, borderRadius: 8, overflow: 'hidden' }]}>
            <CachedImage source={{ uri: perk.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </View>
        ) : (
          <Placeholder style={{ width: 56, height: 56 }}>
            <GlassIcon color={colors.mute} size={24} />
          </Placeholder>
        )}
        <View style={{ flex: 1, gap: 3 }}>
          <Body size={17} weight="bold">
            {perk.title}
          </Body>
          <Body size={14} color={colors.mute}>
            {perkSubtitle(perk)}
          </Body>
        </View>
        <Pts size={15}>{`${perk.pointsRequired} pts`}</Pts>
      </View>
      <View style={{ gap: 6 }}>
        <Ticks progress={ratio} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Mono size={12}>{`${shown} / ${perk.pointsRequired}`}</Mono>
          <Hand size={19}>{photosToGo(perk.pointsRequired - points, pointsPerPhoto)}</Hand>
        </View>
      </View>
    </Card>
  );
}
