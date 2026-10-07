import { VenueEditScreen } from '@/features/owner/screens/venue-edit-screen';
import { useLocalSearchParams } from 'expo-router';

export default function EditVenueRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const venueId = Array.isArray(id) ? id[0] : id;
  return <VenueEditScreen venueId={venueId} />;
}
