import { SketchMap } from '@/features/venues/components/sketch-map';
import type { Venue } from '@/features/venues/schemas';

type VenueMapProps = {
  venues: Venue[];
  latitude?: number;
  longitude?: number;
  onSelect: (venueId: string) => void;
  height?: number;
};

export function VenueMap({ venues, height = 210 }: VenueMapProps) {
  return <SketchMap height={height} primary={venues[0]?.name} secondary={venues[1]?.name} />;
}
