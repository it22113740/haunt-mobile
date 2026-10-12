import { useId, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Line, Path, Pattern, Polygon, Rect } from 'react-native-svg';
import { useHauntTheme } from '@/theme/colors';

type DoodleShape = {
  box: [number, number];
  paths: { d: string; dash?: string; width?: number }[];
  circles?: { cx: number; cy: number; r: number }[];
};

const DOODLES = {
  sparkle: {
    box: [24, 24],
    paths: [{ d: 'M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z' }],
  },
  star: {
    box: [24, 24],
    paths: [{ d: 'M12 2.5l2.4 6.2 6.6.4-5.1 4.2 1.7 6.5L12 16.2l-5.6 3.6 1.7-6.5L3 9.1l6.6-.4z' }],
  },
  squiggle: {
    box: [120, 20],
    paths: [{ d: 'M2 12c8-12 14 10 22 0s14-12 22 0 14 10 22 0 14-12 22 0 14 10 22 0' }],
  },
  trail: {
    box: [220, 120],
    paths: [
      { d: 'M6 110c30-10 30-50 70-48s40 40 80 20 30-60 50-70', dash: '4 7' },
      { d: 'M198 6l14 14M212 6l-14 14', width: 2.4 },
    ],
  },
  camera: {
    box: [32, 32],
    paths: [{ d: 'M4 10h5l2.5-3.5h9L23 10h5v15H4z' }],
    circles: [{ cx: 16, cy: 17.5, r: 5 }],
  },
  arrow: {
    box: [90, 60],
    paths: [{ d: 'M86 8C70 6 58 14 60 26c2 9 13 6 9-2-6-10-30-4-50 26' }, { d: 'M14 42l3 11 10-5' }],
  },
  cocktail: {
    box: [32, 32],
    paths: [{ d: 'M6 6h20L16 17z' }, { d: 'M16 17v9M10 26h12M23 2l-5 8' }],
    circles: [{ cx: 13, cy: 9, r: 1.6 }],
  },
  sun: {
    box: [48, 48],
    paths: [{ d: 'M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4' }],
    circles: [{ cx: 24, cy: 24, r: 8 }],
  },
  heart: {
    box: [32, 32],
    paths: [{ d: 'M16 27S4 19 4 11.5A6 6 0 0 1 16 9a6 6 0 0 1 12 2.5C28 19 16 27 16 27z' }],
  },
  mug: {
    box: [32, 32],
    paths: [
      { d: 'M6 13h16v5a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z' },
      { d: 'M22 15h2a3 3 0 0 1 0 6h-2M4 28h20M11 4c-1.5 2.5 1.5 3.5 0 6M16 4c-1.5 2.5 1.5 3.5 0 6' },
    ],
  },
  pencil: {
    box: [48, 48],
    paths: [{ d: 'M8 40l4-12L34 6l8 8-22 22z' }, { d: 'M12 28l8 8M30 10l8 8' }],
  },
  ticket: {
    box: [60, 36],
    paths: [{ d: 'M3 4h54v9a5 5 0 0 0 0 10v9H3v-9a5 5 0 0 0 0-10z' }, { d: 'M40 5v26', dash: '3 3' }],
  },
  compass: {
    box: [40, 40],
    paths: [{ d: 'M26 14l-3.5 8.5L14 26l3.5-8.5z' }, { d: 'M20 2v3M20 35v3M2 20h3M35 20h3' }],
    circles: [{ cx: 20, cy: 20, r: 16 }],
  },
  pin: {
    box: [32, 32],
    paths: [{ d: 'M16 30s9-8 9-15a9 9 0 0 0-18 0c0 7 9 15 9 15z' }],
    circles: [{ cx: 16, cy: 15, r: 3.2 }],
  },
  bell: {
    box: [32, 32],
    paths: [{ d: 'M9 22v-8a7 7 0 0 1 14 0v8l2.5 3h-19z' }, { d: 'M13.5 28a2.5 2.5 0 0 0 5 0M16 4v3' }],
  },
} satisfies Record<string, DoodleShape>;

export type DoodleKind = keyof typeof DOODLES;

export type DoodleProps = {
  kind: DoodleKind;
  size: number;
  accent?: boolean;
  rotate?: number;
  style?: StyleProp<ViewStyle>;
};

/** Hand-drawn margin doodle. Purely decorative: never intercepts touches or screen readers. */
export function Doodle({ kind, size, accent = false, rotate = 0, style }: DoodleProps) {
  const { colors } = useHauntTheme();
  const shape: DoodleShape = DOODLES[kind];
  const [w, h] = shape.box;
  const stroke = accent ? colors.accent : colors.doodle;
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ position: 'absolute', transform: [{ rotate: `${rotate}deg` }] }, style]}>
      <Svg width={size} height={(size * h) / w} viewBox={`0 0 ${w} ${h}`} fill="none">
        {shape.paths.map((path) => (
          <Path
            key={path.d}
            d={path.d}
            stroke={stroke}
            strokeWidth={path.width ?? 1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={path.dash}
          />
        ))}
        {shape.circles?.map((circle) => (
          <Circle
            key={`${circle.cx}-${circle.cy}`}
            {...circle}
            stroke={stroke}
            strokeWidth={1.6}
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
}

const TAPE_EDGE = [
  [0, 8], [6, 0], [12, 10], [18, 0], [24, 8], [30, 0], [36, 8], [42, 0], [48, 10], [54, 0], [60, 8], [66, 0],
  [72, 10], [78, 0], [84, 8], [90, 0], [96, 10], [100, 2], [100, 92], [94, 100], [88, 90], [82, 100], [76, 92],
  [70, 100], [64, 90], [58, 100], [52, 92], [46, 100], [40, 90], [34, 100], [28, 92], [22, 100], [16, 90],
  [10, 100], [4, 92], [0, 100],
] as const;

/** Torn strip of masking tape. Position it absolutely over a card edge. */
export function Tape({
  ash = false,
  rotate = 0,
  style,
}: {
  ash?: boolean;
  rotate?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, isJournal } = useHauntTheme();
  const width = isJournal ? 84 : 78;
  const height = isJournal ? 24 : 22;
  const points = TAPE_EDGE.map(([x, y]) => `${(x / 100) * width},${(y / 100) * height}`).join(' ');
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ position: 'absolute', zIndex: 3, transform: [{ rotate: `${rotate}deg` }] }, style]}>
      <Svg width={width} height={height}>
        <Polygon points={points} fill={ash ? colors.tapeAsh : colors.tape} />
      </Svg>
    </View>
  );
}

function useSvgId(prefix: string) {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

/** Ruler-style progress bar with a tick every 10pt. */
export function Ticks({ progress, style }: { progress: number; style?: StyleProp<ViewStyle> }) {
  const { colors } = useHauntTheme();
  const base = useSvgId('tb');
  const fill = useSvgId('tf');
  const percent = `${Math.round(Math.min(1, Math.max(0, progress)) * 1000) / 10}%`;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(Math.min(1, Math.max(0, progress)) * 100) }}
      style={[{ height: 11.5 }, style]}>
      <Svg width="100%" height={10}>
        <Defs>
          <Pattern id={base} width={10} height={10} patternUnits="userSpaceOnUse">
            <Rect width={1.5} height={10} fill={colors.lineStrong} />
          </Pattern>
          <Pattern id={fill} width={10} height={10} patternUnits="userSpaceOnUse">
            <Rect width={1.5} height={10} fill={colors.accent} />
          </Pattern>
        </Defs>
        <Rect width="100%" height={10} fill={`url(#${base})`} />
        <Rect width={percent} height={10} fill={`url(#${fill})`} />
      </Svg>
      <View style={{ height: 1.5, backgroundColor: colors.lineStrong }} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 2.5,
          width: percent as `${number}%`,
          backgroundColor: colors.accent,
        }}
      />
    </View>
  );
}

/** Striped photo placeholder (`.ph`). Plain ash in the white style. */
export function Placeholder({
  children,
  style,
  radius = 8,
  bordered = true,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  bordered?: boolean;
}) {
  const { colors, isJournal } = useHauntTheme();
  const stripes = useSvgId('ph');
  return (
    <View
      style={[
        {
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.placeholder,
          borderRadius: radius,
        },
        bordered && { borderWidth: isJournal ? 1.5 : 1, borderColor: isJournal ? colors.ink : colors.line },
        style,
      ]}>
      {isJournal ? (
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <Pattern
              id={stripes}
              width={8}
              height={8}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)">
              <Rect width={1} height={8} fill="rgba(29,25,21,0.06)" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${stripes})`} />
        </Svg>
      ) : null}
      {children}
    </View>
  );
}

/** Journal paper dot grid. Renders nothing in the white style. */
export function DotGrid() {
  const { colors, isJournal } = useHauntTheme();
  const dots = useSvgId('dg');
  if (!isJournal) return null;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id={dots} width={18} height={18} patternUnits="userSpaceOnUse">
          <Circle cx={1} cy={1} r={1} fill={colors.dot} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${dots})`} />
    </Svg>
  );
}

export type StampTone = 'ok' | 'no' | 'wait' | 'used';

export function Stamp({
  label,
  tone,
  rotate = 0,
  heavy = false,
  color: colorOverride,
  background,
  style,
}: {
  label: string;
  tone: StampTone;
  rotate?: number;
  heavy?: boolean;
  color?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useHauntTheme();
  const color = colorOverride ?? { ok: colors.good, no: colors.danger, wait: colors.accentDeep, used: colors.mute }[tone];
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderWidth: heavy ? 2 : 1.5,
          borderColor: color,
          borderRadius: 4,
          backgroundColor: background,
          transform: [{ rotate: `${rotate}deg` }],
        },
        style,
      ]}>
      <Text
        style={{
          fontFamily: 'IBMPlexMono_500Medium',
          fontSize: 11,
          letterSpacing: 1.32,
          textTransform: 'uppercase',
          color,
        }}>
        {label}
      </Text>
    </View>
  );
}

export function Rule({ style }: { style?: StyleProp<ViewStyle> }) {
  const { colors } = useHauntTheme();
  return <View style={[{ height: 1, backgroundColor: colors.line }, style]} />;
}

/** 1.5pt dashed rule (`.dash`). Drawn with SVG so single-side dashes render on every platform. */
export function DashRule({
  vertical = false,
  color,
  width = 1.5,
  dash = '5 4',
  style,
}: {
  vertical?: boolean;
  color?: string;
  width?: number;
  dash?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useHauntTheme();
  const stroke = color ?? colors.lineStrong;
  return (
    <View
      pointerEvents="none"
      style={[vertical ? { width, alignSelf: 'stretch' } : { height: width, alignSelf: 'stretch' }, style]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Line
          x1={vertical ? width / 2 : 0}
          y1={vertical ? 0 : width / 2}
          x2={vertical ? width / 2 : '100%'}
          y2={vertical ? '100%' : width / 2}
          stroke={stroke}
          strokeWidth={width}
          strokeDasharray={dash}
        />
      </Svg>
    </View>
  );
}

/** White polaroid frame used for guest photos in the white style. */
export function Polaroid({
  children,
  rotate = 0,
  style,
}: {
  children: ReactNode;
  rotate?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          paddingTop: 5,
          paddingHorizontal: 5,
          paddingBottom: 16,
          boxShadow: '0px 8px 18px -10px rgba(24,24,26,0.4)',
          transform: [{ rotate: `${rotate}deg` }],
        },
        style,
      ]}>
      {children}
    </View>
  );
}
