import type { HuntColors } from '@/theme/colors';
import Svg, { Circle, Path } from 'react-native-svg';

type MapStyleRule = {
  elementType?: string;
  featureType?: string;
  stylers: Record<string, string>[];
};

/** Google Maps (Android) styling that mirrors the sketch-map palette. Apple Maps uses `mutedStandard`. */
export function sketchStyle(colors: HuntColors): MapStyleRule[] {
  return [
    { elementType: 'geometry', stylers: [{ color: colors.mapBg }] },
    { elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'labels.text', stylers: [{ visibility: 'on' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: colors.mapLabel }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: colors.mapBg }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: colors.mapRoadSoft }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: colors.mapRoad }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: colors.mapRoad }] },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: colors.mapWater }] },
  ];
}

/** Orange teardrop pin; anchor it at the bottom centre (`{ x: 0.5, y: 1 }`). */
export function MapPin({ colors, size = 30 }: { colors: HuntColors; size?: number }) {
  return (
    <Svg width={size} height={(size * 4) / 3} viewBox="-15 -38 30 40">
      <Path
        d="M0 0c-9-11-13-17-13-23a13 13 0 0 1 26 0c0 6-4 12-13 23z"
        fill={colors.accent}
        stroke={colors.ink}
        strokeWidth={1.6}
      />
      <Circle cy={-23} r={4} fill={colors.ink} />
    </Svg>
  );
}

export function formatCoords(lat: number, lng: number) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}
