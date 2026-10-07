import { Illustration } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type CaptureSuccessProps = {
  points: number;
  onActivity: () => void;
  onAgain: () => void;
};

export function CaptureSuccess({ points, onActivity, onAgain }: CaptureSuccessProps) {
  const scale = useSharedValue(0.86);
  const opacity = useSharedValue(0);
  const art = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));

  useEffect(() => {
    scale.value = withTiming(1, { duration: 360 });
    opacity.value = withTiming(1, { duration: 360 });
  }, [opacity, scale]);

  return (
    <View className="flex-1 items-center justify-center bg-haunt-paper px-6">
      <Animated.View style={art}>
        <Illustration name="success-sent" size={200} />
      </Animated.View>
      <Text className="mt-6 text-center font-display text-display-lg text-haunt-ink">Sent for review</Text>
      <Text className="mt-3 text-center font-sans text-body text-haunt-mute">
        You&apos;ll earn up to +{points} points once approved
      </Text>
      <View className="mt-8 w-full gap-3">
        <Button label="View activity" onPress={onActivity} />
        <Button label="Capture another" variant="secondary" onPress={onAgain} />
      </View>
    </View>
  );
}
