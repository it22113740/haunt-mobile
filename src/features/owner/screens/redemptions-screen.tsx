import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { AppHeader, ScreenHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { TextField } from '@/components/ui/text-field';
import { useHauntColors } from '@/theme/colors';
import { useMarkRedemptionUsed, useOwnerRedemptions } from '@/features/owner/hooks';
import type { OwnerRedemption } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CodeFilter = 'ISSUED' | 'USED' | 'ALL';

function formatWhen(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function RedemptionsScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const colors = useHauntColors();
  const redemptions = useOwnerRedemptions();
  const markUsed = useMarkRedemptionUsed();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CodeFilter>('ALL');
  const [pending, setPending] = useState<OwnerRedemption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refreshControl = useListRefresh([redemptions]);
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (redemptions.data ?? []).filter((item) => {
      const statusOk = filter === 'ALL' || item.status === filter;
      const codeOk = !needle || item.promoCode.toLowerCase().includes(needle);
      return statusOk && codeOk;
    });
  }, [filter, query, redemptions.data]);

  if (redemptions.isPending) return <ScreenState loading skeleton="ticket" title="Loading codes" />;
  if (redemptions.isError) {
    return (
      <ScreenState
        title="Couldn’t load codes"
        detail="Check your connection and try again."
        action="Try again"
        onPress={() => void redemptions.refetch()}
      />
    );
  }

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <AppHeader />
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: tabInset + 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
        ListHeaderComponent={
          <View className="mb-4">
            <ScreenHeader title="Codes" subtitle="Find a guest’s code and mark it used." />
            <View className="mt-6 px-6">
              <TextField
                large
                mono
                value={query}
                onChangeText={(text) => setQuery(text.toUpperCase())}
                placeholder="PROMO CODE"
                autoCapitalize="characters"
                leftIcon={<Search color={colors.mute} size={18} />}
              />
            </View>
            <View className="mt-4 flex-row gap-2 px-6">
              <Chip label="Issued" selected={filter === 'ISSUED'} onPress={() => setFilter('ISSUED')} />
              <Chip label="Used" selected={filter === 'USED'} onPress={() => setFilter('USED')} />
              <Chip label="All" selected={filter === 'ALL'} onPress={() => setFilter('ALL')} />
            </View>
            {error ? <Text className="mt-3 px-6 font-sans text-caption text-haunt-danger">{error}</Text> : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <CodeTicket item={item} onUse={() => setPending(item)} />
          </ListEnter>
        )}
        ListEmptyComponent={
          <EmptyState
            illustration="empty-wallet"
            title={query.trim() ? 'No code matches' : 'No codes yet'}
            detail={query.trim() ? 'Check the letters and try again.' : 'Redeemed perks will show up here.'}
          />
        }
      />
      <ConfirmDialog
        visible={Boolean(pending)}
        title="Mark this code used?"
        detail={pending ? `${pending.promoCode} can only be used once.` : ''}
        confirmLabel="Mark used"
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          const id = pending.id;
          setPending(null);
          markUsed.mutate(id, {
            onError: (markError) => setError(getApiErrorMessage(markError, 'Could not mark this code used.')),
          });
        }}
      />
    </ScreenEnter>
  );
}

function CodeTicket({ item, onUse }: { item: OwnerRedemption; onUse: () => void }) {
  const guest = item.user.username || item.user.email;
  return (
    <View className="mx-6 mb-4 overflow-visible rounded-3xl bg-haunt-card px-5 py-5">
      <View className="absolute -left-3 top-16 h-6 w-6 rounded-full bg-haunt-paper" />
      <View className="absolute -right-3 top-16 h-6 w-6 rounded-full bg-haunt-paper" />
      <Text className="font-mono-bold text-display-lg text-haunt-ink">{item.promoCode}</Text>
      <View className="my-4 border-t border-dashed border-haunt-line" />
      <Text className="font-sans-semibold text-body text-haunt-ink">{item.perk.title}</Text>
      <Text className="mt-1 font-sans text-caption text-haunt-mute">
        {guest} · {item.perk.venue.name}
      </Text>
      <Text className="mt-2 font-sans text-caption text-haunt-mute">
        {item.pointsSpent} pts · {formatWhen(item.createdAt)}
      </Text>
      {item.status === 'USED' ? (
        <View className="mt-4 flex-row items-center gap-3">
          <Badge label="Used" tone="good" />
          {item.usedAt ? <Text className="font-sans text-caption text-haunt-mute">{formatWhen(item.usedAt)}</Text> : null}
        </View>
      ) : (
        <View className="mt-4">
          <Button size="md" label="Mark used" onPress={onUse} />
        </View>
      )}
    </View>
  );
}
