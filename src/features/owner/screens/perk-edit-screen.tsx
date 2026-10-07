import { ScreenState } from '@/components/screen-state';
import { ScreenEnter } from '@/components/ui/enter';
import { FormHeader } from '@/features/owner/components/form-header';
import { PerkForm } from '@/features/owner/components/perk-form';
import { useMyPerks, useMyVenues } from '@/features/owner/hooks';
import { useRouter } from 'expo-router';

type PerkEditScreenProps = {
  perkId?: string;
};

export function PerkEditScreen({ perkId }: PerkEditScreenProps) {
  const router = useRouter();
  const perks = useMyPerks();
  const venues = useMyVenues();
  const perk = perks.data?.find((item) => item.id === perkId) ?? null;
  const waiting = perks.isPending || venues.isPending;

  if (waiting) return <ScreenState loading skeleton="ticket" title="Loading perk" />;
  if (perks.isError || venues.isError) {
    return (
      <ScreenState
        title="Couldn’t load this perk"
        action="Try again"
        onPress={() => {
          void perks.refetch();
          void venues.refetch();
        }}
      />
    );
  }
  if (perkId && !perk) return <ScreenState title="Perk unavailable" action="Go back" onPress={() => router.back()} />;
  if (!perkId && (venues.data?.length ?? 0) === 0) {
    return (
      <ScreenState
        title="Add a place first"
        detail="A perk belongs to one of your restaurants or bars."
        action="Add a place"
        onPress={() => router.replace('/(owner)/venue/new')}
      />
    );
  }

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper">
      <FormHeader title={perk ? 'Edit perk' : 'New perk'} />
      <PerkForm perk={perk} venues={venues.data ?? []} onSaved={() => router.back()} />
    </ScreenEnter>
  );
}
