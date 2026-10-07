import { VenueDetailScreen } from '@/features/venues/screens/venue-detail-screen';
import { useLocalSearchParams } from 'expo-router';

export default function VenueRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const venueId = Array.isArray(id) ? id[0] : id;
  if (!venueId) return null;
  return <VenueDetailScreen venueId={venueId} />;
}
