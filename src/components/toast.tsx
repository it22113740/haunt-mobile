import { hapticWarning } from '@/components/ui/press';
import { useSurfaces } from '@/theme/surfaces';
import { Check, Info, TriangleAlert } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Animated, { SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastTone = 'info' | 'success' | 'warning';

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

const listeners = new Set<(item: ToastItem) => void>();
let nextId = 0;

export function showToast(message: string, tone: ToastTone = 'info') {
  if (tone === 'warning') hapticWarning();
  const item = { id: nextId + 1, message, tone };
  nextId = item.id;
  listeners.forEach((listener) => listener(item));
}

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const { colors, surfaces } = useSurfaces();
  const [toast, setToast] = useState<ToastItem | null>(null);

  useEffect(() => {
    const listener = (item: ToastItem) => setToast(item);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const Icon = toast.tone === 'success' ? Check : toast.tone === 'warning' ? TriangleAlert : Info;
  const iconColor = toast.tone === 'success' ? colors.good : toast.tone === 'warning' ? colors.danger : colors.accentDeep;

  return (
    <Animated.View
      key={toast.id}
      entering={SlideInDown.duration(280)}
      exiting={SlideOutUp.duration(220)}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        surfaces.raised,
        {
          position: 'absolute',
          left: 20,
          right: 20,
          top: insets.top + 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
        },
      ]}>
      <Icon color={iconColor} size={20} strokeWidth={1.9} />
      <Text style={{ flex: 1, fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 15, color: colors.ink }}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}
