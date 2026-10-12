import { CachedImage } from '@/components/cached-image';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { ActionMenu } from '@/components/ui/action-menu';
import { Card } from '@/components/ui/card';
import { StatStrip } from '@/components/ui/controls';
import { Doodle, Placeholder, Tape } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { Body, H2, Label, MarkedHeading, Mono } from '@/components/ui/typography';
import { AddTile } from '@/features/owner/components/add-tile';
import { useDeleteVenue, useMyPerks, useMyVenues, useOwnerRedemptions, useOwnerSubmissions } from '@/features/owner/hooks';
import type { OwnerVenue } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function VenuesScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const { colors, isWhite } = useSurfaces();
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
  const addPlace = () => router.push('/(owner)/venue/new');

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top }}>
      <FlatList
        style={{ flex: 1 }}
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: tabInset, flexGrow: 1 }}
        refreshControl={refreshControl}
        ItemSeparatorComponent={() => <View style={{ height: 22 }} />}
        ListHeaderComponent={
          <View style={{ gap: 22, marginBottom: 22 }}>
            <AppHeader tag="for business" />
            <MarkedHeading mark="Your places" marked={isWhite} />
            <StatStrip
              items={[
                {
                  key: 'review',
                  value: submissions.isSuccess ? waiting : '–',
                  label: 'To review',
                  onPress: () => router.push('/(owner)/(tabs)/review'),
                  accessibilityLabel: `${waiting} to review. Open review`,
                },
                {
                  key: 'codes',
                  value: redemptions.isSuccess ? codes : '–',
                  label: codes === 1 ? 'Code issued' : 'Codes issued',
                  onPress: () => router.push('/(owner)/(tabs)/redemptions'),
                  accessibilityLabel: `${codes} codes issued. Open codes`,
                },
                {
                  key: 'perks',
                  value: perks.isSuccess ? activePerks : '–',
                  label: activePerks === 1 ? 'Live perk' : 'Live perks',
                  onPress: () => router.push('/(owner)/(tabs)/perks'),
                  accessibilityLabel: `${activePerks} live perks. Open perks`,
                },
              ]}
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
            <VenueRow
              venue={item}
              taped={isWhite && index === 0}
              onEdit={() => router.push(`/(owner)/venue/${item.id}`)}
              onDelete={() => setPending(item)}
            />
          </ListEnter>
        )}
        ListFooterComponent={
          places.length > 0 ? (
            <View style={{ paddingTop: 22 }}>
              <AddTile label="Add another place" onPress={addPlace} />
              {isWhite ? (
                <View style={{ height: 150 }} pointerEvents="none">
                  <Doodle kind="compass" size={54} style={{ left: 20, top: 26 }} />
                  <Doodle kind="pin" size={40} rotate={10} style={{ right: 40, top: 46 }} />
                  <Doodle kind="trail" size={170} style={{ left: 90, top: 66 }} />
                </View>
              ) : null}
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            illustration="empty-venues"
            title="Add your first place"
            detail="Guests earn points when a visit here is approved."
            action="Add your first place"
            onPress={addPlace}
          />
        }
      />
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

function VenueRow({
  venue,
  taped,
  onEdit,
  onDelete,
}: {
  venue: OwnerVenue;
  taped: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { colors, surfaces, isJournal } = useSurfaces();

  return (
    <View>
      <Card onPress={onEdit} accessibilityLabel={`${venue.name}. Edit place`}>
        <View
          style={{
            height: 170,
            borderBottomWidth: surfaces.image.borderWidth,
            borderBottomColor: isJournal ? colors.ink : colors.line,
          }}>
          {venue.imageUrl ? (
            <CachedImage
              source={{ uri: venue.imageUrl }}
              style={{ height: '100%', width: '100%' }}
              contentFit="cover"
              accessibilityLabel={`Front of ${venue.name}`}
            />
          ) : (
            <Placeholder style={{ flex: 1 }} radius={0} bordered={false}>
              <Label>{venue.category || 'Your place'}</Label>
            </Placeholder>
          )}
        </View>
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 10 }}>
          <View style={{ gap: 3 }}>
            <H2 size={22}>{venue.name}</H2>
            <Body size={14} color={colors.mute}>
              {venue.address}
            </Body>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 4 }}>
            <Mono size={12}>{`◎ ${venue.radiusMeters} m`}</Mono>
            <Mono size={12}>{`+${venue.pointsPerPhoto} photo`}</Mono>
            <Mono size={12}>{`+${venue.pointsPerVideo} video`}</Mono>
          </View>
        </View>
      </Card>
      <ActionMenu
        label={`${venue.name} options`}
        onEdit={onEdit}
        onDelete={onDelete}
        style={{ position: 'absolute', top: 12, right: 12 }}
      />
      {taped ? <Tape rotate={-3} style={{ top: -10, alignSelf: 'center' }} /> : null}
    </View>
  );
}
