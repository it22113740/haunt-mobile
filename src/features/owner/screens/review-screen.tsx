import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Chip } from '@/components/ui/chip';
import { MediaViewer } from '@/components/ui/media-viewer';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader, ScreenHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { RejectSheet } from '@/features/owner/components/reject-sheet';
import { ReviewCard } from '@/features/owner/components/review-card';
import { useMyVenues, useOwnerSubmissions, useReviewSubmission } from '@/features/owner/hooks';
import type { OwnerSubmission } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const venues = useMyVenues();
  const submissions = useOwnerSubmissions();
  const review = useReviewSubmission();
  const [venueId, setVenueId] = useState('all');
  const [status, setStatus] = useState<'PENDING' | 'all'>('PENDING');
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

  const rows = (submissions.data ?? []).filter((item) => {
    const venueOk = venueId === 'all' || item.venue.id === venueId;
    const statusOk = status === 'all' || item.status === 'PENDING';
    return venueOk && statusOk;
  });

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

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <AppHeader />
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: tabInset + 24, flexGrow: 1 }}
        refreshControl={refreshControl}
        ListHeaderComponent={
          <View className="mb-4">
            <ScreenHeader title="Review" subtitle="Approve a visit to award its points." />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, gap: 8 }}>
              <Chip label="All places" selected={venueId === 'all'} onPress={() => setVenueId('all')} />
              {(venues.data ?? []).map((venue) => (
                <Chip key={venue.id} label={venue.name} selected={venueId === venue.id} onPress={() => setVenueId(venue.id)} />
              ))}
              <Chip label="Waiting" selected={status === 'PENDING'} onPress={() => setStatus('PENDING')} />
              <Chip label="All" selected={status === 'all'} onPress={() => setStatus('all')} />
            </ScrollView>
            {error ? <Text className="mt-3 px-6 font-sans text-caption text-haunt-danger">{error}</Text> : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
          <ReviewCard
            item={item}
            venue={(venues.data ?? []).find((venue) => venue.id === item.venue.id)}
            busy={review.isPending && review.variables?.id === item.id}
            leaving={leavingId === item.id}
            onOpen={() => setViewer(item)}
            onApprove={() => {
              setLeavingId(item.id);
              setTimeout(() => decide(item, 'APPROVED'), 260);
            }}
            onReject={() => {
              setReason('');
              setRejecting(item);
            }}
          />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-review"
            title="All caught up"
            detail={status === 'PENDING' ? 'New photos and videos will land here.' : 'Try another place or status.'}
          />
        }
      />
      <MediaViewer url={viewer?.mediaUrl ?? null} kind={viewer?.type ?? null} onClose={() => setViewer(null)} />
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
    </ScreenEnter>
  );
}
