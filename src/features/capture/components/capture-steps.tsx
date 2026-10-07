import { CachedImage } from '@/components/cached-image';
import { Card } from '@/components/ui/card';
import { ListEnter } from '@/components/ui/enter';
import type { Venue } from '@/features/venues/schemas';
import { useHauntColors } from '@/theme/colors';
import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

export function VenueStrip({
  venues,
  selectedId,
  onSelect,
}: {
  venues: Venue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const colors = useHauntColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4" contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
      {venues.map((venue, index) => {
        const selected = venue.id === selectedId;
        return (
          <ListEnter key={venue.id} index={index}>
          <Card
            onPress={() => onSelect(venue.id)}
            className={`w-40 border-2 ${selected ? 'border-haunt-accent' : 'border-transparent'}`}>
            {venue.imageUrl ? (
              <CachedImage source={{ uri: venue.imageUrl }} style={{ height: 88, width: '100%' }} contentFit="cover" />
            ) : (
              <View className="h-[88px] bg-haunt-blush" />
            )}
            <Text className="px-3 py-3 font-sans-semibold text-caption text-haunt-ink" numberOfLines={1}>
              {venue.name}
            </Text>
            {selected ? (
              <View className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-haunt-accent">
                <Check color={colors.onAccent} size={14} />
              </View>
            ) : null}
          </Card>
          </ListEnter>
        );
      })}
    </ScrollView>
  );
}

export function ShotTile({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Card onPress={onPress} className="h-28 flex-1 items-center justify-center">
      {icon}
      <Text className="mt-2 font-sans-semibold text-caption text-haunt-ink">{label}</Text>
    </Card>
  );
}

export function ProgressCard({ ratio }: { ratio: number }) {
  const percent = Math.round(ratio * 100);
  return (
    <View className="mx-6 mt-4 rounded-3xl bg-haunt-card p-4 shadow-card" style={{ elevation: 4 }}>
      <Text className="font-sans-semibold text-body text-haunt-ink">{percent}%</Text>
      <View className="mt-3 h-2 overflow-hidden rounded-full bg-haunt-blush">
        <View className="h-2 rounded-full bg-haunt-accent" style={{ width: `${Math.max(percent, 6)}%` }} />
      </View>
    </View>
  );
}
