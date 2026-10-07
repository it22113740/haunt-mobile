import { CachedImage } from '@/components/cached-image';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { ActionMenu } from '@/components/ui/action-menu';
import { Card } from '@/components/ui/card';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader, ScreenHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { AddFab } from '@/features/owner/components/add-fab';
import { useDeleteVenue, useMyPerks, useMyVenues, useOwnerRedemptions, useOwnerSubmissions } from '@/features/owner/hooks';
import type { OwnerVenue } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function VenuesScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const venues = useMyVenues();
  const perks = useMyPerks();
  const submissions = useOwnerSubmissions();
  const redemptions = useOwnerRedemptions();
  const remove = useDeleteVenue();
  const [pending, setPending] = useState<OwnerVenue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refreshControl = useListRefresh([venues, perks, submissions, redemptions]);
  const waiting = (submissions.data ?? []).filter((item) => item.status === 'PENDING').length;
  const codes = redemptions.data?.length ?? 0;
  const activePerks = perks.data?.length ?? 0;

  if (venues.isPending) return <ScreenState loading title="Loading your places" />;
  if (venues.isError) {
    return (
      <ScreenState
        title="Couldn’t load places"
        detail="Check your connection and try again."
        action="Try again"
        onPress={() => void venues.refetch()}
      />
    );
  }

  const places = venues.data ?? [];

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <AppHeader />
      <FlatList
        style={{ flex: 1 }}
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: tabInset + 72, flexGrow: 1 }}
        refreshControl={refreshControl}
        ListHeaderComponent={
          <View className="mb-4">
            <ScreenHeader title="Your places" subtitle="The restaurants and bars guests can visit." />
            <View className="mt-4 flex-row gap-3 px-6">
              <StatCard label="Waiting review" value={submissions.isSuccess ? waiting : '–'} onPress={() => router.push('/(owner)/(tabs)/review')} />
              <StatCard label="Codes issued" value={redemptions.isSuccess ? codes : '–'} onPress={() => router.push('/(owner)/(tabs)/redemptions')} />
              <StatCard label="Active perks" value={perks.isSuccess ? activePerks : '–'} onPress={() => router.push('/(owner)/(tabs)/perks')} />
            </View>
            {error ? <Text className="mt-3 px-6 font-sans text-caption text-haunt-danger">{error}</Text> : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <VenueRow
              venue={item}
              onEdit={() => router.push(`/(owner)/venue/${item.id}`)}
              onDelete={() => setPending(item)}
            />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-venues"
            title="Add your first place"
            detail="Guests earn points when a visit here is approved."
            action="Add your first place"
            onPress={() => router.push('/(owner)/venue/new')}
          />
        }
      />
      {places.length > 0 ? (
        <AddFab onPress={() => router.push('/(owner)/venue/new')} bottom={Math.max(insets.bottom, 12) + 100} />
      ) : null}
      <ConfirmDialog
        visible={Boolean(pending)}
        title={`Delete ${pending?.name ?? 'this place'}?`}
        detail="Perks and visits for it go away too."
        confirmLabel="Delete place"
        tone="danger"
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          const id = pending.id;
          setPending(null);
          remove.mutate(id, {
            onError: (deleteError) => setError(getApiErrorMessage(deleteError, 'Could not delete this place.')),
          });
        }}
      />
    </ScreenEnter>
  );
}

function StatCard({ label, value, onPress }: { label: string; value: number | string; onPress: () => void }) {
  return (
    <Card onPress={onPress} className="flex-1 px-3 py-4">
      <Text className="font-display text-title text-haunt-ink">{value}</Text>
      <Text className="mt-1 font-sans text-caption text-haunt-mute">{label}</Text>
    </Card>
  );
}

function VenueRow({ venue, onEdit, onDelete }: { venue: OwnerVenue; onEdit: () => void; onDelete: () => void }) {
  return (
    <View className="relative mx-6 mb-4">
      <Card onPress={onEdit}>
        <View className="h-[160px] justify-end">
          {venue.imageUrl ? (
            <CachedImage source={{ uri: venue.imageUrl }} style={{ height: 160, width: '100%' }} contentFit="cover" />
          ) : (
            <View className="h-[160px] items-center justify-center bg-haunt-blush">
              <Text className="font-sans-semibold text-body text-haunt-accent">{venue.category || 'Venue'}</Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(28,22,18,0.5)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 72 }}
          />
        </View>
        <View className="px-5 pb-5 pr-16 pt-4">
          <Text className="font-display text-title text-haunt-ink">{venue.name}</Text>
          <Text className="mt-1 font-sans text-caption text-haunt-mute">{venue.address}</Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            <Pill label={`${venue.radiusMeters} m`} />
            <Pill label={`+${venue.pointsPerPhoto} photo`} />
            <Pill label={`+${venue.pointsPerVideo} video`} />
          </View>
        </View>
      </Card>
      <View className="absolute right-4 top-4">
        <ActionMenu onEdit={onEdit} onDelete={onDelete} />
      </View>
    </View>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-haunt-blush px-3 py-1">
      <Text className="font-sans-semibold text-caption text-haunt-ink">{label}</Text>
    </View>
  );
}
