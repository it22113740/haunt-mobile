import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { useHauntColors } from '@/theme/colors';
import { Text, TextInput, View } from 'react-native';

const quickReasons = ['Not at venue', 'Low quality', 'Not related'];

type RejectSheetProps = {
  visible: boolean;
  reason: string;
  loading?: boolean;
  onChangeReason: (reason: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function RejectSheet({ visible, reason, loading, onChangeReason, onClose, onSubmit }: RejectSheetProps) {
  const colors = useHauntColors();
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text className="font-display text-title text-haunt-ink">Reject this visit</Text>
      <Text className="mt-2 font-sans text-body text-haunt-mute">Pick a reason, or write your own.</Text>
      <View className="mt-4 flex-row flex-wrap gap-2">
        {quickReasons.map((item) => (
          <Chip key={item} label={item} selected={reason === item} onPress={() => onChangeReason(item)} />
        ))}
      </View>
      <TextInput
        value={reason}
        onChangeText={onChangeReason}
        placeholder="Custom reason"
        placeholderTextColor={colors.mute}
        multiline
        className="mt-4 min-h-24 rounded-2xl border border-haunt-line bg-haunt-paper px-4 py-3 font-sans text-body text-haunt-ink"
      />
      <View className="mt-4 gap-2">
        <Button variant="danger" label="Reject visit" onPress={onSubmit} loading={loading} disabled={reason.trim().length === 0} />
        <Button variant="ghost" label="Cancel" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}
