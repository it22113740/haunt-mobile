import { ScreenState } from '@/components/screen-state';
import { ScreenEnter } from '@/components/ui/enter';
import { FormHeader } from '@/features/owner/components/form-header';
import { VenueForm } from '@/features/owner/components/venue-form';
import { useMyVenues } from '@/features/owner/hooks';
import { useUserLocation } from '@/features/venues/hooks';
import { useRouter } from 'expo-router';

type VenueEditScreenProps = {
  venueId?: string;
};

export function VenueEditScreen({ venueId }: VenueEditScreenProps) {
  const router = useRouter();
  const venues = useMyVenues();
  const location = useUserLocation();
  const venue = venues.data?.find((item) => item.id === venueId) ?? null;
  const waiting = venues.isPending || (!venueId && location.isPending);

  if (waiting) return <ScreenState loading title="Loading place" />;
  if (venues.isError) {
    return <ScreenState title="Couldn’t load this place" action="Try again" onPress={() => void venues.refetch()} />;
  }
  if (venueId && !venue) {
    return <ScreenState title="Place unavailable" action="Go back" onPress={() => router.back()} />;
  }

  return (
    <ScreenEnter className="flex-1 bg-hunt-paper">
      <FormHeader title={venue ? 'Edit place' : 'New place'} />
      <VenueForm venue={venue} origin={location.data} onSaved={() => router.back()} />
    </ScreenEnter>
  );
}
