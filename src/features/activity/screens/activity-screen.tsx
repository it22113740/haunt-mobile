import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Chip } from '@/components/ui/chip';
import { MediaTile } from '@/components/ui/media-tile';
import { MediaViewer } from '@/components/ui/media-viewer';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { StatusBadge } from '@/features/activity/components/status-badge';
import { useMySubmissions } from '@/features/activity/hooks';
import type { Submission } from '@/features/activity/schemas';
import { useHauntColors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { Camera, Video } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, SectionList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Filter = 'ALL' | Submission['status'];

const filters: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
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
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [viewer, setViewer] = useState<Submission | null>(null);
  const submissions = useMySubmissions();
  const refreshControl = useListRefresh([submissions]);
  const rows = submissions.data ?? [];

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
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: tabInset + 24, flexGrow: 1 }}
        refreshControl={refreshControl}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View>
            <AppHeader />
            <View className="mx-6 flex-row rounded-3xl bg-haunt-card p-4 shadow-card" style={{ elevation: 4 }}>
              <Summary label="Approved" value={String(approved)} />
              <Summary label="Pending" value={String(pending)} />
              <Summary label="Points" value={String(earned)} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4" contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
              {filters.map((item) => (
                <Chip key={item.id} label={item.label} selected={filter === item.id} onPress={() => setFilter(item.id)} />
              ))}
            </ScrollView>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text className="mb-2 mt-6 px-6 font-sans-semibold text-caption text-haunt-mute">{section.title}</Text>
        )}
        renderItem={({ item, index }) => (
          <ListEnter index={index} className="px-6">
            <SubmissionRow item={item} onOpen={() => setViewer(item)} />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-visits"
            title={rows.length === 0 ? 'No visits yet' : 'Nothing here'}
            detail={rows.length === 0 ? 'Capture a photo or video at a venue to start earning.' : 'No visits match this filter.'}
            action={rows.length === 0 ? 'Capture a visit' : undefined}
            onPress={rows.length === 0 ? () => router.push('/(user)/(tabs)/capture') : undefined}
          />
        }
      />
      <MediaViewer url={viewer?.mediaUrl ?? null} kind={viewer?.type ?? null} onClose={() => setViewer(null)} />
    </ScreenEnter>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="font-display text-title text-haunt-ink">{value}</Text>
      <Text className="mt-1 font-sans text-caption text-haunt-mute">{label}</Text>
    </View>
  );
}

function SubmissionRow({ item, onOpen }: { item: Submission; onOpen: () => void }) {
  const colors = useHauntColors();
  const Icon = item.type === 'PHOTO' ? Camera : Video;
  const time = new Date(item.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <View className="mb-3 flex-row rounded-3xl bg-haunt-card p-3 shadow-card" style={{ elevation: 4 }}>
      <MediaTile uri={item.mediaUrl} kind={item.type} onPress={onOpen} />
      <View className="ml-3 flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 font-sans-semibold text-body text-haunt-ink">{item.venue.name}</Text>
          <StatusBadge status={item.status} />
        </View>
        <View className="mt-1 flex-row items-center">
          <Icon color={colors.mute} size={14} />
          <Text className="ml-1 font-sans text-caption text-haunt-mute">{time}</Text>
        </View>
        {item.status === 'APPROVED' && item.pointsAwarded != null ? (
          <Text className="mt-2 font-display text-body text-haunt-good">+{item.pointsAwarded}</Text>
        ) : null}
        {item.status === 'REJECTED' && item.rejectionReason ? (
          <Text className="mt-2 font-sans text-caption text-haunt-danger">{item.rejectionReason}</Text>
        ) : null}
      </View>
    </View>
  );
}
