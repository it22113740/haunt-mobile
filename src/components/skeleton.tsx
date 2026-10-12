import { DotGrid } from '@/components/ui/decor';
import { useSurfaces } from '@/theme/surfaces';
import { useEffect } from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { MotionView } from '@/components/ui/animated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SkeletonBlockProps = {
  height: number;
  width?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBlock({ height, width = '100%', radius = 8, style }: SkeletonBlockProps) {
  const { colors } = useSurfaces();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(1, { duration: 700 }), -1, true));
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <MotionView
      style={[
        { height, width, borderRadius: radius, backgroundColor: colors.placeholder, marginBottom: 12 },
        animated,
        style,
      ]}
    />
  );
}

export type SkeletonShape = 'venue' | 'ticket' | 'activity';

export function SkeletonScreen({ label, shape = 'venue' }: { label: string; shape?: SkeletonShape }) {
  const insets = useSafeAreaInsets();
  const { colors } = useSurfaces();
  const count = shape === 'activity' ? 4 : 3;

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      accessibilityLabel={label}
      style={{ flex: 1, backgroundColor: colors.paper, paddingHorizontal: 20, paddingTop: insets.top + 22 }}>
      <DotGrid />
      <SkeletonBlock height={30} width="46%" />
      <SkeletonBlock height={16} width="62%" style={{ marginBottom: 22 }} />
      {Array.from({ length: count }, (_, index) =>
        shape === 'ticket' ? (
          <TicketSkeleton key={index} />
        ) : shape === 'activity' ? (
          <ActivitySkeleton key={index} />
        ) : (
          <VenueSkeleton key={index} />
        ),
      )}
    </Animated.View>
  );
}

function VenueSkeleton() {
  const { surfaces } = useSurfaces();
  return (
    <View style={[surfaces.card, { marginBottom: 16, overflow: 'hidden' }]}>
      <SkeletonBlock height={170} radius={0} style={{ marginBottom: 0 }} />
      <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
        <SkeletonBlock height={22} width="58%" />
        <SkeletonBlock height={14} width="76%" />
      </View>
    </View>
  );
}

function TicketSkeleton() {
  const { surfaces } = useSurfaces();
  return (
    <View style={[surfaces.card, { marginBottom: 16, padding: 16 }]}>
      <SkeletonBlock height={26} width="62%" />
      <SkeletonBlock height={14} width="40%" />
      <SkeletonBlock height={14} width="48%" style={{ marginBottom: 0 }} />
    </View>
  );
}

function ActivitySkeleton() {
  const { colors } = useSurfaces();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
        marginBottom: 2,
      }}>
      <SkeletonBlock height={52} width={52} radius={6} style={{ marginBottom: 0 }} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <SkeletonBlock height={16} width="58%" style={{ marginBottom: 8 }} />
        <SkeletonBlock height={12} width="36%" style={{ marginBottom: 0 }} />
      </View>
    </View>
  );
}
