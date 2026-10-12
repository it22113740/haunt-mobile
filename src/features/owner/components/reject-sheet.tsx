import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { TextField } from '@/components/ui/text-field';
import { H2, Label, Sub } from '@/components/ui/typography';
import { View } from 'react-native';

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
  return (
    <BottomSheet visible={visible} onClose={onClose} accessibilityLabel="Reject this visit">
      <View style={{ gap: 18 }}>
        <View style={{ gap: 6 }}>
          <Label>Reject</Label>
          <H2 size={24}>Why doesn’t this one count?</H2>
          <Sub size={14}>The guest sees your reason in their log.</Sub>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {quickReasons.map((item) => (
            <Chip key={item} label={item} selected={reason === item} onPress={() => onChangeReason(item)} />
          ))}
        </View>
        <TextField
          label="Or write your own"
          value={reason}
          onChangeText={onChangeReason}
          placeholder="Custom reason"
          autoCapitalize="sentences"
          multiline
        />
        <View style={{ gap: 10 }}>
          <Button
            variant="danger"
            label="Reject visit"
            onPress={onSubmit}
            loading={loading}
            disabled={reason.trim().length === 0}
          />
          <Button variant="secondary" label="Cancel" onPress={onClose} />
        </View>
      </View>
    </BottomSheet>
  );
}
