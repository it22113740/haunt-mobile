import { PressScale } from '@/components/ui/press-scale';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Segmented } from '@/components/ui/controls';
import { Doodle } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { MediaViewer } from '@/components/ui/media-viewer';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { Body, H1, H2, Hand, Label, ScribbleUnderline, Sub } from '@/components/ui/typography';
import { RejectSheet } from '@/features/owner/components/reject-sheet';
import { ReviewCard, ReviewViewerFooter } from '@/features/owner/components/review-card';
import { useMyVenues, useOwnerSubmissions, useReviewSubmission } from '@/features/owner/hooks';
import type { OwnerSubmission, OwnerVenue } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type StatusFilter = 'PENDING' | 'all';

export function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const { colors, isWhite } = useSurfaces();
  const venues = useMyVenues();
  const submissions = useOwnerSubmissions();
  const review = useReviewSubmission();
  const [venueId, setVenueId] = useState('all');
  const [picking, setPicking] = useState(false);
  const [status, setStatus] = useState<StatusFilter>('PENDING');
  const [viewer, setViewer] = useState<OwnerSubmission | null>(null);
  const [rejecting, setRejecting] = useState<OwnerSubmission | null>(null);
  const [reason, setReason] = useState('');
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refreshControl = useListRefresh([submissions, venues]);

  if (submissions.isPending) return <ScreenState loading skeleton="activity" title="Loading visits" />;
  if (submissions.isError) {
    return (
      <ScreenState
        title="Couldn’t load visits"
        detail="Check your connection and try again."
        action="Try again"
        onPress={() => void submissions.refetch()}
      />
    );
  }

  const places = venues.data ?? [];
  const inVenue = (submissions.data ?? []).filter((item) => venueId === 'all' || item.venue.id === venueId);
  const waitingCount = inVenue.filter((item) => item.status === 'PENDING').length;
  const rows = status === 'all' ? inVenue : inVenue.filter((item) => item.status === 'PENDING');
  const venueFor = (item: OwnerSubmission) => places.find((venue) => venue.id === item.venue.id);
  const firstPendingId = rows.find((item) => item.status === 'PENDING')?.id;
  const venueLabel = venueId === 'all' ? 'All places' : (places.find((venue) => venue.id === venueId)?.name ?? 'All places');

  const decide = (item: OwnerSubmission, next: 'APPROVED' | 'REJECTED', rejectionReason?: string) => {
    setError(null);
    review.mutate(
      { id: item.id, status: next, rejectionReason },
      {
        onSuccess: () => {
          setRejecting(null);
          setReason('');
          setLeavingId(null);
        },
        onError: (reviewError) => {
          setLeavingId(null);
          setError(getApiErrorMessage(reviewError, 'Could not review this visit.'));
        },
      },
    );
  };

  const approve = (item: OwnerSubmission) => {
    setLeavingId(item.id);
    setTimeout(() => decide(item, 'APPROVED'), 260);
  };

  const startReject = (item: OwnerSubmission) => {
    setReason('');
    setRejecting(item);
  };

  return (
    <ScreenEnter className="flex-1 bg-hunt-paper" style={{ paddingTop: insets.top }}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: tabInset, flexGrow: 1 }}
        refreshControl={refreshControl}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListHeaderComponent={
          <View style={{ gap: 18, marginBottom: 18 }}>
            {isWhite ? <Doodle kind="sparkle" size={16} accent style={{ left: 108, top: 4 }} /> : null}
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <H1 size={28} accessibilityRole="header">
                  Review
                </H1>
                <PlacePickerChip label={venueLabel} onPress={() => setPicking(true)} />
              </View>
              <Sub>Check each shot is really from your place, then hand out the points.</Sub>
            </View>
            <Segmented
              options={[
                { value: 'PENDING', label: 'Waiting', count: waitingCount },
                { value: 'all', label: 'All' },
              ]}
              value={status}
              onChange={setStatus}
            />
            {error ? (
              <Body size={14} color={colors.danger}>
                {error}
              </Body>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <ReviewCard
              item={item}
              venue={venueFor(item)}
              taped={isWhite && item.id === firstPendingId}
              busy={review.isPending && review.variables?.id === item.id}
              leaving={leavingId === item.id}
              onOpen={() => setViewer(item)}
              onApprove={() => approve(item)}
              onReject={() => startReject(item)}
            />
          </ListEnter>
        )}
        ListEmptyComponent={
          status === 'PENDING' ? (
            <CaughtUp />
          ) : (
            <EmptyState illustration="empty-review" title="Nothing here yet" detail="Try another place." />
          )
        }
      />
      <MediaViewer
        url={viewer?.mediaUrl ?? null}
        kind={viewer?.type ?? null}
        onClose={() => setViewer(null)}
        footer={
          viewer ? (
            <ReviewViewerFooter
              item={viewer}
              venue={venueFor(viewer)}
              busy={review.isPending && review.variables?.id === viewer.id}
              onApprove={() => {
                const item = viewer;
                setViewer(null);
                approve(item);
              }}
              onReject={() => {
                const item = viewer;
                setViewer(null);
                startReject(item);
              }}
            />
          ) : null
        }
      />
      <RejectSheet
        visible={Boolean(rejecting)}
        reason={reason}
        loading={review.isPending}
        onChangeReason={setReason}
        onClose={() => setRejecting(null)}
        onSubmit={() => {
          if (rejecting) decide(rejecting, 'REJECTED', reason.trim());
        }}
      />
      <PlacePickerSheet
        visible={picking}
        places={places}
        value={venueId}
        onClose={() => setPicking(false)}
        onChange={(next) => {
          setVenueId(next);
          setPicking(false);
        }}
      />
    </ScreenEnter>
  );
}

function PlacePickerChip({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useSurfaces();
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={`Showing ${label}. Change place`}
      hitSlop={6}
      onPress={onPress}
      style={{
        height: 34,
        maxWidth: 180,
        paddingHorizontal: 14,
        borderRadius: 99,
        borderWidth: 1.5,
        borderColor: colors.ink,
        backgroundColor: colors.card,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}>
      <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: colors.ink }}>
        {label}
      </Text>
      <ChevronDown color={colors.ink} size={14} strokeWidth={2.2} />
    </PressScale>
  );
}

function PlacePickerSheet({
  visible,
  places,
  value,
  onClose,
  onChange,
}: {
  visible: boolean;
  places: OwnerVenue[];
  value: string;
  onClose: () => void;
  onChange: (venueId: string) => void;
}) {
  const options = [{ id: 'all', name: 'All places' }, ...places.map((venue) => ({ id: venue.id, name: venue.name }))];
  return (
    <BottomSheet visible={visible} onClose={onClose} accessibilityLabel="Choose a place">
      <View style={{ gap: 6 }}>
        <Label style={{ marginBottom: 6 }}>Show visits from</Label>
        {options.map((option) => (
          <PlaceOption
            key={option.id}
            label={option.name}
            selected={value === option.id}
            onPress={() => onChange(option.id)}
          />
        ))}
      </View>
    </BottomSheet>
  );
}

function PlaceOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useSurfaces();
  return (
    <PressScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}>
      <Body size={16} weight={selected ? 'bold' : 'regular'} style={{ flex: 1 }} numberOfLines={1}>
        {label}
      </Body>
      {selected ? <Check color={colors.accent} size={20} strokeWidth={2.4} /> : null}
    </PressScale>
  );
}

function CaughtUp() {
  const { colors } = useSurfaces();
  return (
    <View style={{ flex: 1, minHeight: 460 }}>
      <Doodle kind="sparkle" size={20} accent style={{ left: 80, top: 66 }} />
      <Doodle kind="sparkle" size={11} style={{ left: 60, top: 100 }} />
      <Doodle kind="sparkle" size={14} style={{ right: 76, top: 54 }} />
      <Doodle kind="star" size={16} accent rotate={10} style={{ right: 56, top: 100 }} />
      <Doodle kind="mug" size={46} rotate={-8} style={{ left: 26, top: 380 }} />
      <Doodle kind="heart" size={28} rotate={10} style={{ right: 40, top: 390 }} />
      <Doodle kind="squiggle" size={120} style={{ left: 115, top: 460 }} />
      <View style={{ alignItems: 'center', gap: 10, paddingTop: 92 }} accessible accessibilityRole="summary">
        <Svg width={74} height={60} viewBox="0 0 74 60" fill="none">
          <Path
            d="M6 32c6 5 13 12 20 20C36 34 50 16 68 6"
            stroke={colors.accent}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M8 36c5 4 11 10 18 18" stroke={colors.ink} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
        </Svg>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <H2 size={24}>You’re all </H2>
          <ScribbleUnderline>
            <H2 size={24}>caught up</H2>
          </ScribbleUnderline>
        </View>
        <Sub style={{ maxWidth: 260, textAlign: 'center' }}>
          New photos and videos from guests show up here as they come in.
        </Sub>
        <Hand size={22} style={{ marginTop: 8, transform: [{ rotate: '-2deg' }] }}>
          enjoy the quiet
        </Hand>
      </View>
    </View>
  );
}
