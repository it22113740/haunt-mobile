import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import type { Redemption } from '@/features/wallet/schemas';
import { useHauntColors } from '@/theme/colors';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Copy } from 'lucide-react-native';
import { Modal, Platform, Text, View } from 'react-native';

type PromoModalProps = {
  redemption: Redemption | null;
  onClose: () => void;
};

export function PromoModal({ redemption, onClose }: PromoModalProps) {
  const colors = useHauntColors();

  const copy = async () => {
    if (!redemption) return;
    await Clipboard.setStringAsync(redemption.promoCode);
    if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showToast('Code copied');
  };

  return (
    <Modal visible={Boolean(redemption)} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-3xl bg-haunt-card">
          <View className="px-6 pb-5 pt-6">
            <Text className="font-sans-semibold text-caption tracking-widest text-haunt-accent">YOUR CODE</Text>
            <Text className="mt-3 font-mono-bold text-display-lg text-haunt-ink">{redemption?.promoCode}</Text>
            <Text className="mt-2 font-sans-semibold text-body text-haunt-ink">{redemption?.perk.title}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="-ml-3 h-6 w-6 rounded-full bg-black/40" />
            <View className="mx-2 h-px flex-1 border-t border-dashed border-haunt-line" />
            <View className="-mr-3 h-6 w-6 rounded-full bg-black/40" />
          </View>
          <View className="px-6 pb-6 pt-5">
            <Text className="text-center font-sans text-body text-haunt-mute">Show this to staff</Text>
            <View className="mt-4">
              <Button label="Copy" variant="secondary" leftIcon={<Copy color={colors.accent} size={18} />} onPress={() => void copy()} />
            </View>
            <View className="mt-2">
              <Button label="Done" variant="ghost" onPress={onClose} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
