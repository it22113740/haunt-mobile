import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { TextField } from '@/components/ui/text-field';
import { VenueCard } from '@/features/venues/components/venue-card';
import { VenueMap } from '@/features/venues/components/venue-map';
import { useExploreVenues, useUserLocation } from '@/features/venues/hooks';
import { useAuthStore } from '@/stores/auth';
import { useHauntColors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { MapPin, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function greeting(name: string) {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  return `Good ${part}, ${name}`;
}

export function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const colors = useHauntColors();
  const user = useAuthStore((state) => state.user);
  const [browseAll, setBrowseAll] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const explore = useExploreVenues(browseAll);
  const location = useUserLocation();
  const refreshControl = useListRefresh([explore]);
  const name = user?.username || user?.email?.split('@')[0] || 'there';

  const categories = useMemo(() => {
    const names = explore.venues.map((venue) => venue.category).filter((item): item is string => Boolean(item));
    return ['All', ...Array.from(new Set(names))];
  }, [explore.venues]);

  const venues = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return explore.venues.filter((venue) => {
      const categoryOk = category === 'All' || venue.category === category;
      const textOk =
        !needle || venue.name.toLowerCase().includes(needle) || venue.address.toLowerCase().includes(needle);
      return categoryOk && textOk;
    });
  }, [category, explore.venues, query]);

  const openVenue = (venueId: string) => {
    router.push(`/(user)/venue/${venueId}`);
  };

  if (explore.isPending) {
    return <ScreenState loading title="Finding places" detail="Looking for restaurants and bars around you." />;
  }

  if (explore.isError) {
    return (
      <ScreenState
        title="Couldn’t load venues"
        detail="Check your connection and try again."
        action="Try again"
        onPress={() => {
          void explore.refetch();
        }}
      />
    );
  }

  const filtering = query.trim().length > 0 || category !== 'All';

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <AppHeader greeting={greeting(name)} />
      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: tabInset + 24, flexGrow: 1 }}
        refreshControl={refreshControl}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View className="px-6">
              <TextField
                value={query}
                onChangeText={setQuery}
                placeholder="Search name or address"
                leftIcon={<Search color={colors.mute} size={18} />}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-4"
              contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
              {categories.map((item) => (
                <Chip key={item} label={item} selected={item === category} onPress={() => setCategory(item)} />
              ))}
            </ScrollView>
            {explore.locationOff ? (
              <View className="mt-6 px-6">
                <Card onPress={() => void explore.enableLocation()} className="flex-row items-center p-5">
                  <MapPin color={colors.accent} size={20} />
                  <Text className="ml-3 flex-1 font-sans-semibold text-body text-haunt-ink">
                    Turn on location to see what&apos;s nearby
                  </Text>
                </Card>
              </View>
            ) : null}
            <View className="mt-6">
              <VenueMap
                venues={venues}
                latitude={location.data?.lat}
                longitude={location.data?.lng}
                onSelect={openVenue}
              />
            </View>
            <Text className="mb-4 mt-8 px-6 font-display text-title text-haunt-ink">Near you</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index} className="px-6">
            <VenueCard venue={item} onPress={() => openVenue(item.id)} />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-venues"
            title={filtering ? 'No matches' : explore.source === 'near' ? 'Nothing nearby' : 'No venues yet'}
            detail={
              filtering
                ? 'Try another name or category.'
                : explore.source === 'near'
                  ? 'No restaurants or bars are inside range.'
                  : 'Check back once owners publish a place.'
            }
            action={!filtering && explore.source === 'near' ? 'See all venues' : undefined}
            onPress={!filtering && explore.source === 'near' ? () => setBrowseAll(true) : undefined}
          />
        }
      />
    </ScreenEnter>
  );
}
