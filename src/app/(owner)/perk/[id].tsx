import { PerkEditScreen } from '@/features/owner/screens/perk-edit-screen';
import { useLocalSearchParams } from 'expo-router';

export default function EditPerkRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const perkId = Array.isArray(id) ? id[0] : id;
  return <PerkEditScreen perkId={perkId} />;
}
