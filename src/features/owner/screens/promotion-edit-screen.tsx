import { ScreenState } from '@/components/screen-state';
import { ScreenEnter } from '@/components/ui/enter';
import { FormHeader } from '@/features/owner/components/form-header';
import { PromotionForm } from '@/features/owner/components/promotion-form';
import { useMyPromotions, useMyVenues } from '@/features/owner/hooks';
import { useRouter } from 'expo-router';

type PromotionEditScreenProps = {
  promotionId?: string;
};

export function PromotionEditScreen({ promotionId }: PromotionEditScreenProps) {
  const router = useRouter();
  const promotions = useMyPromotions();
  const venues = useMyVenues();
  const promotion = promotions.data?.find((item) => item.id === promotionId) ?? null;
  const waiting = promotions.isPending || venues.isPending;

  if (waiting) return <ScreenState loading skeleton="ticket" title="Loading promotion" />;
  if (promotions.isError || venues.isError) {
    return (
      <ScreenState
        title="Couldn’t load this promotion"
        action="Try again"
        onPress={() => {
          void promotions.refetch();
          void venues.refetch();
        }}
      />
    );
  }
  if (promotionId && !promotion) {
    return <ScreenState title="Promotion unavailable" action="Go back" onPress={() => router.back()} />;
  }
  if (!promotionId && (venues.data?.length ?? 0) === 0) {
    return (
      <ScreenState
        title="Add a place first"
        detail="A promotion belongs to one of your shops."
        action="Add a place"
        onPress={() => router.replace('/(owner)/venue/new')}
      />
    );
  }

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper">
      <FormHeader title={promotion ? 'Edit offer' : 'New offer'} />
      <PromotionForm promotion={promotion} venues={venues.data ?? []} onSaved={() => router.back()} />
    </ScreenEnter>
  );
}
