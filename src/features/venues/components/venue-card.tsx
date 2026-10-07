import { CachedImage } from '@/components/cached-image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PointsPill } from '@/components/ui/points-pill';
import { formatDistance, type Venue } from '@/features/venues/schemas';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

type VenueCardProps = {
  venue: Venue;
  onPress: () => void;
};

export function VenueCard({ venue, onPress }: VenueCardProps) {
  return (
    <Card onPress={onPress} className="mb-4">
      <View className="h-[180px] justify-end">
        {venue.imageUrl ? (
          <CachedImage source={{ uri: venue.imageUrl }} style={{ height: 180, width: '100%' }} contentFit="cover" />
        ) : (
          <View className="h-[180px] items-center justify-center bg-haunt-blush">
            <Text className="font-sans-semibold text-body text-haunt-accent">{venue.category || 'Venue'}</Text>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(28,22,18,0.45)']}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 72 }}
        />
        {venue.category ? (
          <View className="absolute left-3 top-3">
            <Badge label={venue.category} tone="accent" />
          </View>
        ) : null}
        {venue.distance !== undefined ? (
          <View className="absolute right-3 top-3 rounded-full bg-haunt-card px-3 py-1">
            <Text className="font-sans-semibold text-caption text-haunt-ink">{formatDistance(venue.distance)}</Text>
          </View>
        ) : null}
      </View>
      <View className="p-5">
        <Text className="font-display text-title text-haunt-ink">{venue.name}</Text>
        <Text className="mt-1 font-sans text-caption text-haunt-mute" numberOfLines={2}>
          {venue.address}
        </Text>
        <View className="mt-3">
          <PointsPill value={`+${venue.pointsPerPhoto} photo · +${venue.pointsPerVideo} video`} />
        </View>
      </View>
    </Card>
  );
}
