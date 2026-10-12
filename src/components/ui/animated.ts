import { cssInterop } from 'nativewind';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

cssInterop(Animated.View, { className: 'style' });
cssInterop(Animated.Text, { className: 'style' });

/**
 * Animated view that is not registered with NativeWind. Use it (not `Animated.View`) whenever static styles sit
 * next to a `useAnimatedStyle` result: cssInterop merges the array and Reanimated then drops the static styles.
 */
export const MotionView = Animated.createAnimatedComponent(View);
