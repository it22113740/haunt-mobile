import { CachedImage } from '@/components/cached-image';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { SkeletonBlock } from '@/components/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScreenEnter } from '@/components/ui/enter';
import { BackButton } from '@/components/ui/icon-button';
import { MediaViewer } from '@/components/ui/media-viewer';
import { GuestGrid } from '@/features/venues/components/guest-grid';
import { PerkCarousel } from '@/features/venues/components/perk-carousel';
import { PromotionList } from '@/features/venues/components/promotion-list';
import { useVenue, useVenueGallery, useVenuePerks, useVenuePromotions } from '@/features/venues/hooks';
import type { GalleryItem, Perk } from '@/features/venues/schemas';
import { useMyPoints } from '@/features/wallet/hooks';
import { useHauntColors } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, MapPin, Video } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type VenueDetailScreenProps = {
  venueId: string;
};

export function VenueDetailScreen({ venueId }: VenueDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useHauntColors();
  const venueQuery = useVenue(venueId);
  const perks = useVenuePerks(venueId);
  const promotions = useVenuePromotions(venueId);
  const gallery = useVenueGallery(venueId);
  const balance = useMyPoints();
  const venue = venueQuery.venue;
  const [viewer, setViewer] = useState<GalleryItem | null>(null);
  const refreshControl = useListRefresh([venueQuery, perks, promotions, gallery]);
  const mine = balance.data?.byVenue.find((item) => item.venueId === venueId)?.points ?? 0;

  if (venueQuery.isPending) return <ScreenState loading title="Loading venue" />;

  if (venueQuery.isError || !venue) {
    return (
      <ScreenState
        title="Venue unavailable"
        detail="This place isn’t in the list right now."
        action="Go back"
        onPress={() => router.back()}
      />
    );
  }

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper">
      <ScrollView
        style={{ flexGrow: 1, flexShrink: 1, minHeight: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        refreshControl={refreshControl}>
        <View className="h-[300px]">
          {venue.imageUrl ? (
            <CachedImage source={{ uri: venue.imageUrl }} style={{ height: 300, width: '100%' }} contentFit="cover" />
          ) : (
            <View className="h-[300px] items-center justify-center bg-haunt-blush">
              <Text className="font-display text-title text-haunt-accent">{venue.category || 'Venue'}</Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(28,22,18,0.55)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140 }}
          />
          <View className="absolute left-4" style={{ top: insets.top + 8 }}>
            <BackButton />
          </View>
        </View>
        <View className="-mt-6 rounded-t-3xl bg-haunt-paper px-6 pt-6">
          <Text className="font-display text-display-lg text-haunt-ink">{venue.name}</Text>
          {venue.category ? (
            <View className="mt-3 self-start">
              <Badge label={venue.category} tone="accent" />
            </View>
          ) : null}
          <View className="mt-3 flex-row items-start">
            <MapPin color={colors.mute} size={16} />
            <Text className="ml-2 flex-1 font-sans text-body text-haunt-mute">{venue.address}</Text>
          </View>
          {venue.description ? <Text className="mt-4 font-sans text-body text-haunt-ink">{venue.description}</Text> : null}
          <View className="mt-6 flex-row gap-3">
            <StatTile icon={<Camera color={colors.accent} size={18} />} label={`+${venue.pointsPerPhoto} per photo`} />
            <StatTile icon={<Video color={colors.accent} size={18} />} label={`+${venue.pointsPerVideo} per video`} />
          </View>
          <Text className="mb-4 mt-10 font-display text-title text-haunt-ink">Promotions</Text>
          <PromotionList
            promotions={promotions.data}
            pending={promotions.isPending}
            error={promotions.isError}
            onRetry={() => void promotions.refetch()}
          />
          <Text className="mb-4 mt-10 font-display text-title text-haunt-ink">Perks</Text>
          <PerkBlock perks={perks.data} pending={perks.isPending} error={perks.isError} points={mine} onRetry={() => void perks.refetch()} />
          <Text className="mb-1 mt-10 font-display text-title text-haunt-ink">From guests</Text>
          <GuestBlock
            items={gallery.data}
            pending={gallery.isPending}
            error={gallery.isError}
            onRetry={() => void gallery.refetch()}
            onOpen={setViewer}
          />
        </View>
      </ScrollView>
      <MediaViewer url={viewer?.mediaUrl ?? null} kind={viewer?.type ?? null} onClose={() => setViewer(null)} />
      <LinearGradient
        colors={['transparent', colors.paper]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 28, paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button
          label="Capture a visit"
          leftIcon={<Camera color={colors.onAccent} size={18} />}
          onPress={() => router.push({ pathname: '/(user)/(tabs)/capture', params: { venueId } })}
        />
      </LinearGradient>
    </ScreenEnter>
  );
}

function StatTile({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="flex-1 flex-row items-center rounded-3xl bg-haunt-card p-4 shadow-card" style={{ elevation: 4 }}>
      {icon}
      <Text className="ml-2 flex-1 font-display text-caption text-haunt-ink">{label}</Text>
    </View>
  );
}

function PerkBlock({
  perks,
  pending,
  error,
  points,
  onRetry,
}: {
  perks?: Perk[];
  pending: boolean;
  error: boolean;
  points: number;
  onRetry: () => void;
}) {
  if (pending) return <SkeletonBlock height={180} radius={24} />;
  if (error) {
    return (
      <Pressable onPress={onRetry}>
        <Text className="font-sans-semibold text-body text-haunt-accent">Couldn’t load perks. Try again.</Text>
      </Pressable>
    );
  }
  if (!perks?.length) return <EmptyState illustration="empty-perks" title="No perks yet" detail="This place has not published an offer." />;
  return <PerkCarousel perks={perks} points={points} />;
}

function GuestBlock({
  items,
  pending,
  error,
  onRetry,
  onOpen,
}: {
  items?: GalleryItem[];
  pending: boolean;
  error: boolean;
  onRetry: () => void;
  onOpen: (item: GalleryItem) => void;
}) {
  if (pending) return <SkeletonBlock height={112} radius={16} />;
  if (error) {
    return (
      <Pressable onPress={onRetry} className="mt-3">
        <Text className="font-sans-semibold text-body text-haunt-accent">Couldn’t load the gallery. Try again.</Text>
      </Pressable>
    );
  }
  if (!items?.length) return <EmptyState illustration="empty-visits" title="No visits yet" detail="Approved visits will show up here." />;
  return <GuestGrid items={items} onOpen={onOpen} />;
}
