import { PressScale } from '@/components/ui/press-scale';
import { CachedImage } from '@/components/cached-image';
import { Placeholder } from '@/components/ui/decor';
import { Body, Label, Mono, Pts } from '@/components/ui/typography';
import { formatDistance, type Venue } from '@/features/venues/schemas';
import { useSurfaces } from '@/theme/surfaces';
import { View } from 'react-native';

type VenueCardProps = {
  venue: Venue;
  index: number;
  onPress: () => void;
};

/** Numbered journal row: index, photo, name, address and what a visit earns. */
export function VenueCard({ venue, index, onPress }: VenueCardProps) {
  const { colors, surfaces } = useSurfaces();
  const distance = venue.distance !== undefined ? formatDistance(venue.distance) : null;
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={`${venue.name}, ${venue.address}${distance ? `, ${distance} away` : ''}`}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}>
      <Mono size={12} color={colors.faint} style={{ width: 18 }}>
        {String(index + 1).padStart(2, '0')}
      </Mono>
      {venue.imageUrl ? (
        <View style={[surfaces.image, { width: 76, height: 76, borderRadius: 8, overflow: 'hidden' }]}>
          <CachedImage source={{ uri: venue.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>
      ) : (
        <Placeholder style={{ width: 76, height: 76 }}>
          <Label>{venue.category || 'Place'}</Label>
        </Placeholder>
      )}
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Body size={18} weight="bold" numberOfLines={1}>
          {venue.name}
        </Body>
        <Body size={14} color={colors.mute} numberOfLines={1}>
          {distance ? `${distance} · ${venue.address}` : venue.address}
        </Body>
        <Pts>{`+${venue.pointsPerPhoto} photo · +${venue.pointsPerVideo} video`}</Pts>
      </View>
    </PressScale>
  );
}
