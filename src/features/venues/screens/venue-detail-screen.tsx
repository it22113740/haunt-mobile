import { CachedImage } from '@/components/cached-image';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { SkeletonBlock } from '@/components/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashRule, Doodle, Placeholder, Stamp } from '@/components/ui/decor';
import { ScreenEnter } from '@/components/ui/enter';
import { CameraIcon, PinIcon } from '@/components/ui/hunt-icons';
import { BackButton } from '@/components/ui/icon-button';
import { MediaViewer } from '@/components/ui/media-viewer';
import { StatusBarScrim } from '@/components/ui/status-bar-scrim';
import { Body, H1, H2, Label, Mono, Sub } from '@/components/ui/typography';
import { GuestGrid } from '@/features/venues/components/guest-grid';
import { PerkCarousel } from '@/features/venues/components/perk-carousel';
import { PromotionList } from '@/features/venues/components/promotion-list';
import { useVenue, useVenueGallery, useVenuePerks, useVenuePromotions } from '@/features/venues/hooks';
import type { GalleryItem, Perk } from '@/features/venues/schemas';
import { useMyPoints } from '@/features/wallet/hooks';
import { useSurfaces } from '@/theme/surfaces';
import { useIsFocused, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HERO_HEIGHT = 300;

type VenueDetailScreenProps = {
  venueId: string;
};

export function VenueDetailScreen({ venueId }: VenueDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isJournal, isWhite } = useSurfaces();
  const venueQuery = useVenue(venueId);
  const perks = useVenuePerks(venueId);
  const promotions = useVenuePromotions(venueId);
  const gallery = useVenueGallery(venueId);
  const balance = useMyPoints();
  const venue = venueQuery.venue;
  const [viewer, setViewer] = useState<GalleryItem | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const focused = useIsFocused();
  const scrim = useSharedValue(0);
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.get() }));

  useEffect(() => {
    scrim.set(withTiming(pastHero ? 1 : 0, { duration: 160 }));
  }, [pastHero, scrim]);
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

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPastHero(event.nativeEvent.contentOffset.y > HERO_HEIGHT - 4);
  };
  const overPhoto = Boolean(venue.imageUrl) && !pastHero;
  const capture = () => router.push({ pathname: '/(user)/(tabs)/capture', params: { venueId } });
  const strong = isJournal ? { width: 1.5, color: colors.ink } : { width: 1, color: colors.line };

  return (
    <ScreenEnter className="flex-1 bg-hunt-paper">
      <ScrollView
        style={{ flexGrow: 1, flexShrink: 1, minHeight: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        onScroll={onScroll}
        scrollEventThrottle={32}
        refreshControl={refreshControl}>
        <View style={{ height: HERO_HEIGHT + insets.top, borderBottomWidth: strong.width, borderBottomColor: strong.color }}>
          {venue.imageUrl ? (
            <CachedImage
              source={{ uri: venue.imageUrl }}
              style={{ height: '100%', width: '100%' }}
              contentFit="cover"
              accessibilityLabel={`Photo of ${venue.name}`}
            />
          ) : (
            <Placeholder bordered={false} radius={0} style={{ flex: 1 }}>
              <Label>{venue.category || 'Place'}</Label>
            </Placeholder>
          )}
          {venue.imageUrl && insets.top ? <PhotoTopShade height={insets.top + 36} /> : null}
          <View style={{ position: 'absolute', left: 18, top: insets.top + 10 }}>
            <BackButton />
          </View>
          {venue.category ? (
            <Stamp
              label={venue.category}
              tone="used"
              color={colors.ink}
              background={colors.card}
              rotate={-3}
              style={{ position: 'absolute', bottom: 14, right: 16 }}
            />
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 28 }}>
          <View style={{ gap: 8 }}>
            {isWhite ? (
              <>
                <Doodle kind="sparkle" size={20} accent style={{ right: 20, top: 6 }} />
                <Doodle kind="sparkle" size={11} style={{ right: 46, top: 34 }} />
              </>
            ) : null}
            <H1 size={36} style={{ paddingRight: isWhite ? 50 : 0 }}>
              {venue.name}
            </H1>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
              <View style={{ paddingTop: 2 }}>
                <PinIcon color={colors.mute} size={16} />
              </View>
              <Body size={15} color={colors.mute} style={{ flex: 1 }}>
                {venue.address}
              </Body>
            </View>
            {venue.description ? <Body size={16}>{venue.description}</Body> : null}
          </View>

          <View style={{ gap: 10 }}>
            <Label>What a visit earns</Label>
            <Card style={{ flexDirection: 'row' }}>
              <EarnCell value={venue.pointsPerPhoto} label="for each photo" />
              <DashRule vertical width={isJournal ? 1.5 : 1} />
              <EarnCell value={venue.pointsPerVideo} label="for each video" />
            </Card>
            <Body size={13} color={colors.mute}>
              Points land once the bar has looked at your shots.
            </Body>
          </View>

          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <H2>Perks here</H2>
              <Mono size={13}>{`You have ${mine} pts`}</Mono>
            </View>
            <PerkBlock
              perks={perks.data}
              pending={perks.isPending}
              error={perks.isError}
              points={mine}
              pointsPerPhoto={venue.pointsPerPhoto}
              onRetry={() => void perks.refetch()}
            />
          </View>

          <View style={{ gap: 8 }}>
            {isWhite ? <Doodle kind="mug" size={40} rotate={8} style={{ right: 6, top: -8 }} /> : null}
            <H2>Offers</H2>
            <PromotionList
              promotions={promotions.data}
              pending={promotions.isPending}
              error={promotions.isError}
              onRetry={() => void promotions.refetch()}
            />
          </View>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <H2>From guests</H2>
              {gallery.data ? (
                <Mono size={13}>{`${gallery.data.length} ${gallery.data.length === 1 ? 'shot' : 'shots'}`}</Mono>
              ) : null}
            </View>
            <GuestBlock
              items={gallery.data}
              pending={gallery.isPending}
              error={gallery.isError}
              onRetry={() => void gallery.refetch()}
              onOpen={setViewer}
              onCapture={capture}
            />
            {isWhite ? <Doodle kind="heart" size={26} rotate={-10} style={{ right: 10, bottom: -40 }} /> : null}
          </View>
        </View>
      </ScrollView>
      <StatusBarScrim style={scrimStyle} />
      {focused ? <StatusBar style={overPhoto ? 'light' : 'dark'} animated /> : null}
      <MediaViewer url={viewer?.mediaUrl ?? null} kind={viewer?.type ?? null} onClose={() => setViewer(null)} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom, 14) + 10,
          backgroundColor: colors.paper,
          borderTopWidth: strong.width,
          borderTopColor: strong.color,
        }}>
        <Button label="Capture a visit" leftIcon={<CameraIcon color={colors.onAccent} size={20} />} onPress={capture} />
      </View>
    </ScreenEnter>
  );
}

/** Soft dark fade at the top of the photo so light status bar icons stay readable. */
function PhotoTopShade({ height }: { height: number }) {
  return (
    <Svg pointerEvents="none" width="100%" height={height} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
      <Defs>
        <LinearGradient id="venue-top-shade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#000" stopOpacity={0.38} />
          <Stop offset="1" stopColor="#000" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#venue-top-shade)" />
    </Svg>
  );
}

function EarnCell({ value, label }: { value: number; label: string }) {
  const { colors } = useSurfaces();
  return (
    <View style={{ flex: 1, padding: 16, gap: 2 }}>
      <Body size={30} weight="extra" style={{ letterSpacing: -0.9, lineHeight: 34 }}>
        {`+${value}`}
      </Body>
      <Body size={14} color={colors.mute}>
        {label}
      </Body>
    </View>
  );
}

function PerkBlock({
  perks,
  pending,
  error,
  points,
  pointsPerPhoto,
  onRetry,
}: {
  perks?: Perk[];
  pending: boolean;
  error: boolean;
  points: number;
  pointsPerPhoto: number;
  onRetry: () => void;
}) {
  const { colors } = useSurfaces();
  if (pending) return <SkeletonBlock height={130} radius={10} />;
  if (error) {
    return (
      <Pressable accessibilityRole="button" onPress={onRetry}>
        <Body size={15} weight="semibold" color={colors.accentDeep}>
          Couldn’t load perks. Tap to try again.
        </Body>
      </Pressable>
    );
  }
  if (!perks?.length) return <Sub>No perks yet. This place hasn’t set one up.</Sub>;
  return <PerkCarousel perks={perks} points={points} pointsPerPhoto={pointsPerPhoto} />;
}

function GuestBlock({
  items,
  pending,
  error,
  onRetry,
  onOpen,
  onCapture,
}: {
  items?: GalleryItem[];
  pending: boolean;
  error: boolean;
  onRetry: () => void;
  onOpen: (item: GalleryItem) => void;
  onCapture: () => void;
}) {
  const { colors } = useSurfaces();
  if (pending) return <SkeletonBlock height={112} radius={6} />;
  if (error) {
    return (
      <Pressable accessibilityRole="button" onPress={onRetry}>
        <Body size={15} weight="semibold" color={colors.accentDeep}>
          Couldn’t load the gallery. Tap to try again.
        </Body>
      </Pressable>
    );
  }
  return (
    <View style={{ gap: 12 }}>
      {!items?.length ? <Sub>No shots yet. Approved visits show up here.</Sub> : null}
      <GuestGrid items={items ?? []} onOpen={onOpen} onCapture={onCapture} />
    </View>
  );
}
