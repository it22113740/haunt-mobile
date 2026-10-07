import { useHauntColors } from '@/theme/colors';
import { useEffect } from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SkeletonBlockProps = {
  height: number;
  width?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBlock({ height, width = '100%', radius = 16, style }: SkeletonBlockProps) {
  const colors = useHauntColors();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ height, width, borderRadius: radius, backgroundColor: colors.line, marginBottom: 12 }, animated, style]}
    />
  );
}

export type SkeletonShape = 'venue' | 'ticket' | 'activity';

export function SkeletonScreen({ label, shape = 'venue' }: { label: string; shape?: SkeletonShape }) {
  const insets = useSafeAreaInsets();
  const count = shape === 'activity' ? 4 : 3;

  return (
    <Animated.View entering={FadeIn.duration(320)} accessibilityLabel={label} className="flex-1 bg-haunt-paper px-6" style={{ paddingTop: insets.top + 24 }}>
      <SkeletonBlock height={28} width="46%" />
      <SkeletonBlock height={16} width="62%" />
      {Array.from({ length: count }, (_, index) =>
        shape === 'ticket' ? <TicketSkeleton key={index} /> : shape === 'activity' ? <ActivitySkeleton key={index} /> : <VenueSkeleton key={index} />,
      )}
    </Animated.View>
  );
}

function VenueSkeleton() {
  return (
    <View className="mb-4 overflow-hidden rounded-3xl bg-haunt-card">
      <SkeletonBlock height={180} radius={0} style={{ marginBottom: 0 }} />
      <View className="px-5 pt-5">
        <SkeletonBlock height={22} width="58%" />
        <SkeletonBlock height={14} width="76%" />
        <View className="flex-row gap-2">
          <SkeletonBlock height={28} width={72} radius={14} />
          <SkeletonBlock height={28} width={96} radius={14} />
        </View>
      </View>
    </View>
  );
}

function TicketSkeleton() {
  return (
    <View className="mb-4 flex-row overflow-hidden rounded-3xl bg-haunt-card">
      <SkeletonBlock height={132} width={108} radius={0} style={{ marginBottom: 0 }} />
      <View className="flex-1 px-4 pt-4">
        <SkeletonBlock height={22} width={84} radius={11} />
        <SkeletonBlock height={18} width="72%" />
        <SkeletonBlock height={14} width="48%" />
        <SkeletonBlock height={24} width={64} radius={12} />
      </View>
    </View>
  );
}

function ActivitySkeleton() {
  return (
    <View className="mb-3 flex-row items-center rounded-3xl bg-haunt-card p-3">
      <SkeletonBlock height={72} width={72} radius={16} style={{ marginBottom: 0 }} />
      <View className="ml-3 flex-1">
        <SkeletonBlock height={18} width="68%" />
        <SkeletonBlock height={14} width="42%" style={{ marginBottom: 0 }} />
      </View>
    </View>
  );
}
