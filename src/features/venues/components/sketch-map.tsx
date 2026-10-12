import { useHauntColors } from '@/theme/colors';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

/** Hand-drawn map illustration used where a live map is unavailable (web). */
export function SketchMap({ height = 210, primary, secondary }: { height?: number; primary?: string; secondary?: string }) {
  const colors = useHauntColors();
  return (
    <Svg
      viewBox="0 0 350 210"
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid slice"
      accessibilityLabel="Sketch map"
      style={{ backgroundColor: colors.mapBg }}>
      <Path d="M0 0h70c-10 40 8 70-6 110s10 70 0 100H0z" fill={colors.mapWater} />
      <Path d="M0 0h70c-10 40 8 70-6 110s10 70 0 100" fill="none" stroke={colors.ink} strokeWidth={1.2} />
      <Path d="M118 0c10 50 40 80 60 120s30 70 34 90" fill="none" stroke={colors.mapRoad} strokeWidth={7} strokeLinecap="round" />
      <Path d="M70 70c60 6 140-6 280 10" fill="none" stroke={colors.mapRoad} strokeWidth={5} strokeLinecap="round" />
      <Path d="M66 150c80-10 170 6 284-4" fill="none" stroke={colors.mapRoadSoft} strokeWidth={4} strokeLinecap="round" />
      <Path d="M260 0c-6 70 8 140 0 210" fill="none" stroke={colors.mapRoadSoft} strokeWidth={4} strokeLinecap="round" />
      <Path d="M140 66c20 14 40 22 74 36" fill="none" stroke={colors.ink} strokeWidth={1.4} strokeDasharray="3 4" />
      <G transform="translate(140 66)">
        <Circle r={7} fill={colors.card} stroke={colors.ink} strokeWidth={1.6} />
        <Circle r={2.5} fill={colors.ink} />
      </G>
      <G transform="translate(214 102)">
        <Path
          d="M0 0c-9-11-13-17-13-23a13 13 0 0 1 26 0c0 6-4 12-13 23z"
          fill={colors.accent}
          stroke={colors.ink}
          strokeWidth={1.6}
        />
        <Circle cy={-23} r={4} fill={colors.ink} />
      </G>
      {primary ? (
        <SvgText x={228} y={88} fontFamily="Caveat_600SemiBold" fontSize={20} fill={colors.accentDeep}>
          {primary}
        </SvgText>
      ) : null}
      {secondary ? (
        <SvgText x={96} y={50} fontFamily="Caveat_600SemiBold" fontSize={18} fill={colors.mapLabel}>
          {secondary}
        </SvgText>
      ) : null}
    </Svg>
  );
}
