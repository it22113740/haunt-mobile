import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { MoreHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

type ActionMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function ActionMenu({ onEdit, onDelete }: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton icon={MoreHorizontal} label="Actions" onPress={() => setOpen(true)} />
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <View className="gap-3">
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
