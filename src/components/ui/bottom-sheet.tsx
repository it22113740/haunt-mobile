import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} className="absolute inset-0 bg-black/40" />
        <Animated.View
          entering={SlideInDown.duration(240)}
          className="rounded-t-3xl bg-haunt-card px-6 pt-3"
          style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="mb-4 h-1.5 w-10 self-center rounded-full bg-haunt-line" />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
