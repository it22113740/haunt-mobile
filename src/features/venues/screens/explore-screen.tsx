import { PressScale } from '@/components/ui/press-scale';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Doodle, Rule, Tape } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { TextField } from '@/components/ui/text-field';
import { Body, H1, H2, Hand, Label, MarkedHeading } from '@/components/ui/typography';
import { VenueCard } from '@/features/venues/components/venue-card';
import { VenueMap } from '@/features/venues/components/venue-map';
import { useCityName, useExploreVenues, usePromotionFeed, useUserLocation } from '@/features/venues/hooks';
import { shortDate } from '@/lib/dates';
import { useAuthStore } from '@/stores/auth';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { ChevronRight, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categoryPlural: Record<string, string> = {
  Restaurant: 'Restaurants',
  Bar: 'Bars',
  Cafe: 'Cafés',
  Other: 'Other',
};

export function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const { colors, isJournal, isWhite } = useSurfaces();
  const user = useAuthStore((state) => state.user);
  const [browseAll, setBrowseAll] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const explore = useExploreVenues(browseAll);
  const location = useUserLocation();
  const city = useCityName(location.data);
  const promotions = usePromotionFeed();
  const refreshControl = useListRefresh([explore]);
  const name = user?.username || user?.email?.split('@')[0] || 'there';
  const offer = promotions.data?.[0];

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
  const scope = city.data ?? (explore.source === 'near' ? 'Near you' : 'All places');
  const mapNote = explore.locationOff
    ? 'Location is off. Showing all places.'
    : explore.source === 'near'
      ? 'Showing places around you.'
      : 'Showing every place on Hunt.';

  return (
    <ScreenEnter className="flex-1 bg-hunt-paper" style={{ paddingTop: insets.top }}>
      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: tabInset, flexGrow: 1 }}
        refreshControl={refreshControl}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={{ gap: 22 }}>
            {isWhite ? (
              <>
                <Doodle kind="sparkle" size={16} accent style={{ right: 54, top: 4 }} />
                <Doodle kind="sparkle" size={10} style={{ right: 76, top: 22 }} />
                <Doodle kind="squiggle" size={80} rotate={-4} style={{ left: 130, top: 114 }} />
              </>
            ) : null}
            <AppHeader />

            <View style={{ gap: 8 }}>
              <Label>{`${shortDate(new Date())} · ${scope}`}</Label>
              {isWhite ? (
                <MarkedHeading before="Where to " mark="tonight" after={`, ${name}?`} />
              ) : (
                <H1>{`Where to tonight, ${name}?`}</H1>
              )}
            </View>

            <TextField
              variant="box"
              value={query}
              onChangeText={setQuery}
              placeholder="A place, a street, a craving"
              leftIcon={<Search color={colors.ink} size={20} strokeWidth={1.8} />}
            />

            {categories.length > 1 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
                {categories.map((item) => (
                  <Chip
                    key={item}
                    label={categoryPlural[item] ?? item}
                    selected={item === category}
                    onPress={() => setCategory(item)}
                  />
                ))}
              </ScrollView>
            ) : null}

            <Card>
              <VenueMap
                venues={venues}
                latitude={location.data?.lat}
                longitude={location.data?.lng}
                onSelect={openVenue}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderTopWidth: isJournal ? 1.5 : 1,
                  borderTopColor: isJournal ? colors.ink : colors.line,
                }}>
                <Body size={14} color={colors.mute} style={{ flex: 1 }}>
                  {mapNote}
                </Body>
                {explore.locationOff ? (
                  <Chip compact strong label="Turn on" onPress={() => void explore.enableLocation()} />
                ) : null}
              </View>
            </Card>

            {offer ? (
              <PressScale
                accessibilityRole="button"
                accessibilityLabel={`Offer: ${offer.title} at ${offer.venue.name}`}
                onPress={() => router.push('/(user)/(tabs)/promotions')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: colors.accentDeep,
                  borderRadius: 10,
                  backgroundColor: colors.blush,
                }}>
                {isWhite ? <Tape ash rotate={5} style={{ top: -10, right: 22 }} /> : null}
                <Label color={colors.accentDeep}>Tonight</Label>
                <Body size={15} weight="semibold" style={{ flex: 1 }} numberOfLines={2}>
                  {`${offer.title} at ${offer.venue.name}`}
                </Body>
                <ChevronRight color={colors.ink} size={18} strokeWidth={1.8} />
              </PressScale>
            ) : null}

            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <H2>On the map</H2>
                <Hand>{`${venues.length} ${venues.length === 1 ? 'spot' : 'spots'} so far`}</Hand>
              </View>
              <Rule />
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <VenueCard venue={item} index={index} onPress={() => openVenue(item.id)} />
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
            actionLabelColor={isWhite ? '#FFFFFF' : undefined}
            onPress={!filtering && explore.source === 'near' ? () => setBrowseAll(true) : undefined}
          />
        }
      />
    </ScreenEnter>
  );
}
