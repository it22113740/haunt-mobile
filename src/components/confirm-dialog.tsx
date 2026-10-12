import { Button } from '@/components/ui/button';
import { H2, Sub } from '@/components/ui/typography';
import { useSurfaces } from '@/theme/surfaces';
import { Modal, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

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
  const { colors, surfaces } = useSurfaces();
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          backgroundColor: colors.scrim,
        }}>
        <Animated.View
          entering={ZoomIn.duration(200)}
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={[surfaces.raised, { width: '100%', maxWidth: 420, padding: 22, gap: 8 }]}>
          <H2 size={22}>{title}</H2>
          <Sub>{detail}</Sub>
          <View style={{ marginTop: 18, gap: 10 }}>
            <Button label={confirmLabel} variant={tone === 'danger' ? 'danger' : 'primary'} onPress={onConfirm} />
            <Button label="Cancel" variant="secondary" onPress={onClose} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
