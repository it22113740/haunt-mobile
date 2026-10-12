import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useHuntColors } from '@/theme/colors';

type TextKitProps = Omit<TextProps, 'style'> & {
  children?: ReactNode;
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
};

/** Mono, uppercase, tracked: section labels and small captions. */
export function Label({ children, color, size = 11, style, ...rest }: TextKitProps) {
  const colors = useHuntColors();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: 'IBMPlexMono_400Regular',
          fontSize: size,
          letterSpacing: size * 0.08,
          textTransform: 'uppercase',
          color: color ?? colors.mute,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

/** Handwritten Caveat note in orange ink. */
export function Hand({ children, color, size = 20, style, ...rest }: TextKitProps) {
  const colors = useHuntColors();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: 'Caveat_600SemiBold',
          fontSize: size,
          lineHeight: Math.round(size * 1.15),
          color: color ?? colors.accentDeep,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function H1({ children, color, size = 32, style, ...rest }: TextKitProps) {
  const colors = useHuntColors();
  return (
    <Text
      accessibilityRole="header"
      {...rest}
      style={[
        {
          fontFamily: 'BricolageGrotesque_700Bold',
          fontSize: size,
          lineHeight: Math.round(size * 1.08),
          letterSpacing: -size * 0.02,
          color: color ?? colors.ink,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function H2({ children, color, size = 20, style, ...rest }: TextKitProps) {
  const colors = useHuntColors();
  return (
    <Text
      accessibilityRole="header"
      {...rest}
      style={[
        {
          fontFamily: 'BricolageGrotesque_700Bold',
          fontSize: size,
          lineHeight: Math.round(size * 1.2),
          letterSpacing: -size * 0.01,
          color: color ?? colors.ink,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Sub({ children, color, size = 15, style, ...rest }: TextKitProps) {
  const colors = useHuntColors();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: 'BricolageGrotesque_400Regular',
          fontSize: size,
          lineHeight: Math.round(size * 1.4),
          color: color ?? colors.mute,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Body({
  children,
  color,
  size = 16,
  weight = 'regular',
  style,
  ...rest
}: TextKitProps & { weight?: 'regular' | 'semibold' | 'bold' | 'extra' }) {
  const colors = useHuntColors();
  const family = {
    regular: 'BricolageGrotesque_400Regular',
    semibold: 'BricolageGrotesque_600SemiBold',
    bold: 'BricolageGrotesque_700Bold',
    extra: 'BricolageGrotesque_800ExtraBold',
  }[weight];
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: family, fontSize: size, lineHeight: Math.round(size * 1.3), color: color ?? colors.ink },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Mono({
  children,
  color,
  size = 12,
  medium = false,
  style,
  ...rest
}: TextKitProps & { medium?: boolean }) {
  const colors = useHuntColors();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: medium ? 'IBMPlexMono_500Medium' : 'IBMPlexMono_400Regular',
          fontSize: size,
          letterSpacing: size * 0.02,
          color: color ?? colors.mute,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

/** Points text: `+10 photo · +20 video`, `40 pts`. */
export function Pts({ children, color, size = 13, style, ...rest }: TextKitProps) {
  const colors = useHuntColors();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: 'IBMPlexMono_500Medium',
          fontSize: size,
          letterSpacing: size * 0.02,
          color: color ?? colors.accentDeep,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

export function Wordmark({ size = 22 }: { size?: number }) {
  const colors = useHuntColors();
  const dot = Math.round(size * 0.32);
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel="Hunt"
      style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Text
        style={{
          fontFamily: 'BricolageGrotesque_800ExtraBold',
          fontSize: size,
          lineHeight: Math.round(size * 1.15),
          letterSpacing: -size * 0.04,
          color: colors.ink,
        }}>
        hunt
      </Text>
      <View
        style={{
          width: dot,
          height: dot,
          borderRadius: dot,
          backgroundColor: colors.accent,
          marginLeft: 1,
          marginBottom: Math.round(size * 0.24),
        }}
      />
    </View>
  );
}

const UNDERLINE = 'M3 10C40 4 90 3 120 6s60 4 77-1';
const CIRCLE = 'M150 8C70 4 10 22 12 56c2 34 90 48 170 42s108-30 104-56C282 14 220 4 130 12';

/** Orange scribble drawn under a word. Wrap the word's `Text` with it. */
export function ScribbleUnderline({
  children,
  color,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useHuntColors();
  return (
    <View style={[{ position: 'relative', alignSelf: 'flex-start' }, style]}>
      {children}
      <Svg
        pointerEvents="none"
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        width="104%"
        height={12}
        style={{ position: 'absolute', left: '-2%', bottom: -6 }}>
        <Path d={UNDERLINE} fill="none" stroke={color ?? colors.accent} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** Orange scribble loop drawn around a number. */
export function ScribbleCircle({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const colors = useHuntColors();
  return (
    <View style={[{ position: 'relative', alignSelf: 'flex-start' }, style]}>
      <Svg
        pointerEvents="none"
        viewBox="0 0 300 110"
        preserveAspectRatio="none"
        style={{ position: 'absolute', left: -16, right: -16, top: -10, bottom: -10 }}>
        <Path d={CIRCLE} fill="none" stroke={colors.accent} strokeWidth={3} strokeLinecap="round" />
      </Svg>
      {children}
    </View>
  );
}

/**
 * Heading where one phrase gets the white-style scribble underline.
 * Words wrap naturally; the marked phrase stays on one line.
 */
export function MarkedHeading({
  before,
  mark,
  after,
  size = 32,
  level = 1,
  marked = true,
}: {
  before?: string;
  mark: string;
  after?: string;
  size?: number;
  level?: 1 | 2;
  marked?: boolean;
}) {
  const Heading = level === 1 ? H1 : H2;
  if (!marked) {
    return (
      <Heading size={size}>
        {before}
        {mark}
        {after}
      </Heading>
    );
  }
  const words = (value?: string) => value?.match(/\s*\S+\s*/g) ?? [];
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={`${before ?? ''}${mark}${after ?? ''}`}
      style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      {words(before).map((word, index) => (
        <Heading key={`b${index}`} size={size}>
          {word}
        </Heading>
      ))}
      <ScribbleUnderline>
        <Heading size={size}>{mark}</Heading>
      </ScribbleUnderline>
      {words(after).map((word, index) => (
        <Heading key={`a${index}`} size={size}>
          {word}
        </Heading>
      ))}
    </View>
  );
}
