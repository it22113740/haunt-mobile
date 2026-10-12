import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Segmented, StatStrip } from '@/components/ui/controls';
import { Doodle } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { MediaTile } from '@/components/ui/media-tile';
import { MediaViewer } from '@/components/ui/media-viewer';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { Body, Hand, Label, Mono } from '@/components/ui/typography';
import { StatusBadge } from '@/features/activity/components/status-badge';
import { useMySubmissions } from '@/features/activity/hooks';
import type { Submission } from '@/features/activity/schemas';
import { clockTime, shortDate } from '@/lib/dates';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { SectionList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Filter = 'ALL' | Submission['status'];

const filters: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Waiting' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

function dayKey(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const diff = Math.round((start.getTime() - day.getTime()) / 86_400_000);
  if (diff === 0) return `Today · ${shortDate(date)}`;
  if (diff === 1) return `Yesterday · ${shortDate(date)}`;
  return shortDate(date);
}

export function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const { isWhite } = useSurfaces();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [viewer, setViewer] = useState<Submission | null>(null);
  const submissions = useMySubmissions();
  const refreshControl = useListRefresh([submissions]);
  const rows = useMemo(() => submissions.data ?? [], [submissions.data]);

  const sections = useMemo(() => {
    const visible = filter === 'ALL' ? rows : rows.filter((item) => item.status === filter);
    const sorted = [...visible].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const groups = new Map<string, Submission[]>();
    for (const item of sorted) {
      const key = dayKey(item.createdAt);
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    return Array.from(groups.values()).map((data) => ({ title: dayLabel(data[0].createdAt), data }));
  }, [filter, rows]);

  const approved = rows.filter((item) => item.status === 'APPROVED').length;
  const pending = rows.filter((item) => item.status === 'PENDING').length;
  const earned = rows.reduce((sum, item) => sum + (item.status === 'APPROVED' ? (item.pointsAwarded ?? 0) : 0), 0);

  if (submissions.isPending) return <ScreenState loading skeleton="activity" title="Loading activity" />;

  if (submissions.isError) {
    return (
      <ScreenState
        title="Couldn’t load activity"
        detail="Check your connection and try again."
        action="Try again"
        onPress={() => void submissions.refetch()}
      />
    );
  }

  return (
    <ScreenEnter className="flex-1 bg-hunt-paper" style={{ paddingTop: insets.top }}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: tabInset, flexGrow: 1 }}
        refreshControl={refreshControl}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={{ gap: 18, marginBottom: 14 }}>
            {isWhite ? (
              <>
                <Doodle kind="sparkle" size={16} accent style={{ left: 136, top: 4 }} />
                <Doodle kind="sparkle" size={9} style={{ left: 156, top: 22 }} />
              </>
            ) : null}
            <AppHeader title="Your log" markTitle />
            <StatStrip
              items={[
                { key: 'approved', value: approved, label: 'Approved' },
                { key: 'waiting', value: pending, label: 'Waiting' },
                { key: 'earned', value: earned, label: 'Pts earned', accent: true },
              ]}
            />
            <Segmented options={filters} value={filter} onChange={setFilter} />
          </View>
        }
        renderSectionHeader={({ section }) => <Label style={{ paddingTop: 4, paddingBottom: 6 }}>{section.title}</Label>}
        renderSectionFooter={() => <View style={{ height: 14 }} />}
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <SubmissionRow item={item} onOpen={() => setViewer(item)} />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-visits"
            title={rows.length === 0 ? 'No visits yet' : 'Nothing here yet'}
            detail={
              rows.length === 0 ? 'Capture a photo or video at a venue to start earning.' : 'No visits match this filter.'
            }
            action={rows.length === 0 ? 'Capture a visit' : undefined}
            onPress={rows.length === 0 ? () => router.push('/(user)/(tabs)/capture') : undefined}
          />
        }
      />
      <MediaViewer url={viewer?.mediaUrl ?? null} kind={viewer?.type ?? null} onClose={() => setViewer(null)} />
    </ScreenEnter>
  );
}

function SubmissionRow({ item, onOpen }: { item: Submission; onOpen: () => void }) {
  const { colors } = useSurfaces();
  const kind = item.type === 'PHOTO' ? 'Photo' : 'Video';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}>
      <MediaTile uri={item.mediaUrl} kind={item.type} size={52} onPress={onOpen} />
      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <Body size={16} weight="bold" numberOfLines={1}>
          {item.venue.name}
        </Body>
        <Mono size={12}>{`${kind} · ${clockTime(item.createdAt)}`}</Mono>
        {item.status === 'REJECTED' && item.rejectionReason ? (
          <Hand size={18} color={colors.danger} style={{ lineHeight: 20 }}>
            {`“${item.rejectionReason}”`}
          </Hand>
        ) : null}
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <StatusBadge status={item.status} />
        {item.status === 'APPROVED' && item.pointsAwarded != null ? (
          <Mono size={14} medium color={colors.good}>{`+${item.pointsAwarded}`}</Mono>
        ) : null}
      </View>
    </View>
  );
}
