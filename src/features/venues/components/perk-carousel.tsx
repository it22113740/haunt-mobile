import { CachedImage } from '@/components/cached-image';
import { Badge } from '@/components/ui/badge';
import { ListEnter } from '@/components/ui/enter';
import { PointsPill } from '@/components/ui/points-pill';
import type { Perk } from '@/features/venues/schemas';
import { useHauntColors } from '@/theme/colors';
import { UtensilsCrossed } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

const typeLabel = { DISCOUNT: 'Discount', FREE_MEAL: 'Free meal', OTHER: 'Perk' } as const;

export function PerkCarousel({ perks, points }: { perks: Perk[]; points: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 24 }}>
      {perks.map((perk, index) => (
        <ListEnter key={perk.id} index={index}>
          <PerkCard perk={perk} points={points} />
        </ListEnter>
      ))}
    </ScrollView>
  );
}

function PerkCard({ perk, points }: { perk: Perk; points: number }) {
  const colors = useHauntColors();
  const ratio = perk.pointsRequired > 0 ? Math.min(1, points / perk.pointsRequired) : 1;

  return (
    <View className="w-56 overflow-hidden rounded-3xl bg-haunt-card shadow-card" style={{ elevation: 4 }}>
      {perk.imageUrl ? (
        <CachedImage source={{ uri: perk.imageUrl }} style={{ height: 112, width: '100%' }} contentFit="cover" />
      ) : (
        <View className="h-28 items-center justify-center bg-haunt-blush">
          {perk.type === 'FREE_MEAL' ? <UtensilsCrossed color={colors.accent} size={28} /> : null}
        </View>
      )}
      <View className="p-4">
        <Badge label={typeLabel[perk.type]} tone="accent" />
        {perk.type === 'DISCOUNT' && perk.discountPercent ? (
          <Text className="mt-3 font-display text-display-lg text-haunt-ink">{perk.discountPercent}% OFF</Text>
        ) : null}
        {perk.type === 'FREE_MEAL' && perk.imageUrl ? (
          <View className="mt-3">
            <UtensilsCrossed color={colors.accent} size={22} />
          </View>
        ) : null}
        <Text className="mt-2 font-sans-semibold text-body text-haunt-ink">{perk.title}</Text>
        <View className="mt-3">
          <PointsPill value={`${perk.pointsRequired} pts`} />
        </View>
        <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-haunt-blush">
          <View className="h-1.5 rounded-full bg-haunt-accent" style={{ width: `${Math.round(ratio * 100)}%` }} />
        </View>
      </View>
    </View>
  );
}
