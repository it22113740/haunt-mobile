import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { useListRefresh } from '@/components/list-refresh';
import { ScreenState } from '@/components/screen-state';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/controls';
import { DashRule, Doodle, Stamp } from '@/components/ui/decor';
import { ListEnter, ScreenEnter } from '@/components/ui/enter';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { Body, Label, MarkedHeading, Sub } from '@/components/ui/typography';
import { useMarkRedemptionUsed, useOwnerRedemptions } from '@/features/owner/hooks';
import type { OwnerRedemption } from '@/features/owner/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { monthDay } from '@/lib/dates';
import { useSurfaces } from '@/theme/surfaces';
import { Search } from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CodeFilter = 'ISSUED' | 'USED' | 'ALL';

const filters: { value: CodeFilter; label: string }[] = [
  { value: 'ISSUED', label: 'Not used yet' },
  { value: 'USED', label: 'Used' },
  { value: 'ALL', label: 'All' },
];

export function RedemptionsScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const { colors, isWhite } = useSurfaces();
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
    <ScreenEnter className="flex-1 bg-hunt-paper" style={{ paddingTop: insets.top }}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: tabInset, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={refreshControl}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListHeaderComponent={
          <View style={{ gap: 18, marginBottom: 18 }}>
            <View style={{ gap: 8 }}>
              <MarkedHeading mark="Codes" size={28} marked={isWhite} />
              <Sub>A guest shows you a code. Find it here and mark it used.</Sub>
            </View>
            <CodeSearch value={query} onChange={setQuery} />
            <Segmented options={filters} value={filter} onChange={setFilter} />
            {error ? (
              <Body size={14} color={colors.danger}>
                {error}
              </Body>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <ListEnter index={index}>
            <CodeTicket item={item} onUse={() => setPending(item)} />
          </ListEnter>
        )}
        ListFooterComponent={
          isWhite && rows.length > 0 ? (
            <View style={{ height: 150 }} pointerEvents="none">
              <Doodle kind="ticket" size={80} rotate={-8} style={{ left: 20, top: 30 }} />
              <Doodle kind="sparkle" size={18} accent style={{ left: 130, top: 50 }} />
              <Doodle kind="squiggle" size={100} rotate={4} style={{ right: 20, top: 70 }} />
              <Doodle kind="star" size={22} rotate={10} style={{ right: 50, top: 120 }} />
            </View>
          ) : null
        }
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

function CodeSearch({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const { colors, surfaces, isJournal } = useSurfaces();
  return (
    <View
      style={[
        surfaces.boxInput,
        isJournal ? surfaces.hardShadow(3) : surfaces.liftShadow,
        { height: 58, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
      ]}>
      <Search color={colors.ink} size={20} strokeWidth={1.8} />
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.toUpperCase())}
        placeholder="RWD-XXXXXXXX"
        placeholderTextColor={colors.faint}
        autoCapitalize="characters"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="search"
        accessibilityLabel="Find a code"
        selectionColor={colors.accent}
        style={{
          flex: 1,
          height: '100%',
          fontFamily: 'IBMPlexMono_400Regular',
          fontSize: 20,
          letterSpacing: 1.6,
          color: colors.ink,
          paddingVertical: 0,
        }}
      />
    </View>
  );
}

function Notch({ side }: { side: 'left' | 'right' }) {
  const { colors, isJournal } = useSurfaces();
  const border = isJournal ? 1.5 : 1;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: -10,
        ...(side === 'left' ? { left: -border } : { right: -border }),
        width: 10 + border,
        height: 20,
        overflow: 'hidden',
      }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          ...(side === 'left' ? { left: -10 } : { right: -10 }),
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: colors.paper,
          borderWidth: border,
          borderColor: isJournal ? colors.ink : colors.line,
        }}
      />
    </View>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ width: '50%', paddingRight: 12, paddingBottom: 12, gap: 2 }}>
      <Label>{label}</Label>
      {children}
    </View>
  );
}

function CodeTicket({ item, onUse }: { item: OwnerRedemption; onUse: () => void }) {
  const { colors, surfaces, isJournal } = useSurfaces();
  const guest = item.user.username || item.user.email;
  const used = item.status === 'USED';

  return (
    <View style={[surfaces.card, isJournal ? null : surfaces.liftShadow]}>
      <View style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16, paddingRight: used ? 130 : 18 }}>
        <Text
          selectable
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{
            fontFamily: 'IBMPlexMono_500Medium',
            fontSize: 24,
            letterSpacing: 1.44,
            color: used ? colors.mute : colors.ink,
          }}>
          {item.promoCode}
        </Text>
      </View>
      <View>
        <DashRule width={isJournal ? 1.5 : 1} style={{ marginHorizontal: 16 }} />
        <Notch side="left" />
        <Notch side="right" />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 18, paddingRight: 6, paddingTop: 16, paddingBottom: 6 }}>
        <Field label="Perk">
          <Body size={16} weight="bold">
            {item.perk.title}
          </Body>
        </Field>
        <Field label="Guest">
          <Body size={16} weight="semibold" numberOfLines={1}>
            {guest}
          </Body>
        </Field>
        <Field label="Place">
          <Body size={15}>{item.perk.venue.name}</Body>
        </Field>
        <Field label="Cost">
          <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 15, color: colors.ink }}>
            {`${item.pointsSpent} pts · ${monthDay(item.createdAt)}`}
          </Text>
        </Field>
      </View>
      {used ? (
        <View style={{ position: 'absolute', right: 18, top: 18 }} pointerEvents="none">
          <Stamp
            label={item.usedAt ? `Used ${monthDay(item.usedAt)}` : 'Used'}
            tone="used"
            heavy
            rotate={-8}
            color={colors.good}
          />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 18, paddingBottom: 18 }}>
          <Button size="sm" label="Mark used" onPress={onUse} accessibilityHint={`Marks ${item.promoCode} as used`} />
        </View>
      )}
    </View>
  );
}
