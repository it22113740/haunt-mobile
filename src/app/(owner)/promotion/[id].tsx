import { PromotionEditScreen } from '@/features/owner/screens/promotion-edit-screen';
import { useLocalSearchParams } from 'expo-router';

export default function EditPromotionRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const promotionId = Array.isArray(id) ? id[0] : id;
  return <PromotionEditScreen promotionId={promotionId} />;
}
