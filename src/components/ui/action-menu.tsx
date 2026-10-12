import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Label } from '@/components/ui/typography';
import { MoreHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

type ActionMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  /** What the menu acts on, e.g. "Place options". */
  label?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function ActionMenu({ onEdit, onDelete, label = 'Options', size = 40, style }: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton icon={MoreHorizontal} label={label} size={size} style={style} onPress={() => setOpen(true)} />
      <BottomSheet visible={open} onClose={() => setOpen(false)} accessibilityLabel={label}>
        <View style={{ gap: 12 }}>
          <Label>{label}</Label>
          <Button
            variant="secondary"
            label="Edit"
            onPress={() => {
              setOpen(false);
              onEdit();
            }}
          />
          <Button
            variant="danger"
            label="Delete"
            onPress={() => {
              setOpen(false);
              onDelete();
            }}
          />
        </View>
      </BottomSheet>
    </>
  );
}
