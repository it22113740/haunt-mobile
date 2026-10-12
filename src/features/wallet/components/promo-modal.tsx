import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { DashRule, Stamp, Tape } from '@/components/ui/decor';
import { Body, Hand, Label, Sub } from '@/components/ui/typography';
import type { Redemption } from '@/features/wallet/schemas';
import { monthDay } from '@/lib/dates';
import { useSurfaces } from '@/theme/surfaces';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Copy } from 'lucide-react-native';
import { Modal, Platform, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

type PromoModalProps = {
  redemption: Redemption | null;
  onClose: () => void;
};

export function PromoModal({ redemption, onClose }: PromoModalProps) {
  const { colors, surfaces, isJournal } = useSurfaces();
  const used = redemption?.status === 'USED';

  const copy = async () => {
    if (!redemption) return;
    await Clipboard.setStringAsync(redemption.promoCode);
    if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showToast('Code copied');
  };

  return (
    <Modal visible={Boolean(redemption)} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          backgroundColor: colors.scrim,
        }}>
        <Animated.View
          entering={ZoomIn.duration(220)}
          accessibilityViewIsModal
          style={[surfaces.raised, { width: '100%', maxWidth: 420 }]}>
          <Tape rotate={-5} style={{ top: -12, left: 24 }} />
          <Tape ash rotate={6} style={{ top: -12, right: 24 }} />
          <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 18, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Label>Your code</Label>
              <Stamp label={used ? 'Used' : 'Ready'} tone={used ? 'used' : 'wait'} rotate={-4} />
            </View>
            <Text
              selectable
              accessibilityLabel={`Code ${redemption?.promoCode.split('').join(' ')}`}
              style={{
                fontFamily: 'IBMPlexMono_500Medium',
                fontSize: 26,
                letterSpacing: 1.6,
                color: used ? colors.mute : colors.ink,
                textDecorationLine: used ? 'line-through' : 'none',
              }}>
              {redemption?.promoCode}
            </Text>
            <Body size={17} weight="bold">
              {redemption?.perk.title}
            </Body>
            {redemption ? (
              <Body size={13} color={colors.mute}>
                {`${redemption.perk.venue.name} · ${redemption.pointsSpent} pts · ${monthDay(redemption.createdAt)}`}
              </Body>
            ) : null}
          </View>
          <DashRule width={isJournal ? 1.5 : 1} />
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 10 }}>
            <Sub size={14}>Show it at the bar and they’ll mark it used. Each code works once.</Sub>
            {!used ? <Hand>enjoy it!</Hand> : null}
            <Button label="Copy code" leftIcon={<Copy color={colors.onAccent} size={18} />} onPress={() => void copy()} />
            <Button label="Done" variant="secondary" onPress={onClose} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
