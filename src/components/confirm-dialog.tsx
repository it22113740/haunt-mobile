import { hapticLight } from '@/components/ui/press';
import { Modal, Pressable, Text, View } from 'react-native';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  detail: string;
  confirmLabel: string;
  tone?: 'accent' | 'danger';
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  detail,
  confirmLabel,
  tone = 'accent',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-3xl bg-haunt-card p-8">
          <Text className="text-2xl font-semibold text-haunt-ink">{title}</Text>
          <Text className="mt-3 text-base text-haunt-mute">{detail}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              hapticLight();
              onConfirm();
            }}
            className={`mt-8 h-14 items-center justify-center rounded-2xl ${tone === 'danger' ? 'bg-haunt-danger' : 'bg-haunt-accent'}`}>
            <Text className={`text-base font-semibold ${tone === 'danger' ? 'text-haunt-paper' : 'text-haunt-onAccent'}`}>
              {confirmLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              hapticLight();
              onClose();
            }}
            className="mt-2 h-12 items-center justify-center">
            <Text className="text-base font-semibold text-haunt-ink">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
