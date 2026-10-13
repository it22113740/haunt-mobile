import { useHuntTheme } from '@/theme/colors';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  accessibilityLabel?: string;
};

export function BottomSheet({ visible, onClose, children, accessibilityLabel }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors, isJournal } = useHuntTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.scrim }}
        />
        <Animated.View
          entering={SlideInDown.duration(240)}
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          style={{
            backgroundColor: colors.paper,
            borderTopWidth: isJournal ? 1.5 : 1,
            borderTopColor: isJournal ? colors.ink : colors.line,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 14) + 16,
          }}>
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              borderRadius: 9,
              backgroundColor: colors.lineStrong,
              marginBottom: 20,
            }}
          />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
