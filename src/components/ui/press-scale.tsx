import { MotionView } from '@/components/ui/animated';
import { usePressScale } from '@/components/ui/press';
import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const OUTER_KEYS = new Set<string>([
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignSelf',
  'width',
  'minWidth',
  'maxWidth',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'marginStart',
  'marginEnd',
  'position',
  'top',
  'bottom',
  'left',
  'right',
  'start',
  'end',
  'zIndex',
]);

function splitStyle(style: StyleProp<ViewStyle>) {
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(StyleSheet.flatten(style) ?? {})) {
    (OUTER_KEYS.has(key) ? outer : inner)[key] = value;
  }
  return { outer: outer as ViewStyle, inner: inner as ViewStyle };
}

type PressScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  /** Surface and layout of the pressable; placement keys (flex, margins, position, width) go on the touch target. */
  style?: StyleProp<ViewStyle>;
  /** NativeWind classes for the touch target (placement only, e.g. `self-stretch`, `mt-4`). */
  className?: string;
  children: ReactNode;
};

/** Pressable with the shared shrink-on-press feedback. */
export function PressScale({ style, className, children, disabled, onPressIn, onPressOut, ...rest }: PressScaleProps) {
  const press = usePressScale(!disabled);
  const { outer, inner } = splitStyle(style);
  // Growing unconditionally lets Android stretch auto-height buttons inside scroll content.
  const fill = outer.flex != null || outer.flexGrow != null || outer.flexBasis != null;

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      className={className}
      style={outer}
      onPressIn={(event: GestureResponderEvent) => {
        press.onPressIn();
        onPressIn?.(event);
      }}
      onPressOut={(event: GestureResponderEvent) => {
        press.onPressOut();
        onPressOut?.(event);
      }}>
      <MotionView style={[fill ? { flexGrow: 1 } : null, inner, press.style]}>{children}</MotionView>
    </Pressable>
  );
}
