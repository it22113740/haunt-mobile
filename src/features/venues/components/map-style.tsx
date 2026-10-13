import type { HuntColors } from '@/theme/colors';
import type { StyleSpecification } from '@maplibre/maplibre-react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const MAJOR_ROADS = ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'];
const MINOR_ROADS = ['minor', 'service', 'track'];

/** OpenStreetMap vector tiles (OpenFreeMap) drawn in the sketch-map palette, without labels. */
export function sketchMapStyle(colors: HuntColors): StyleSpecification {
  return {
    version: 8,
    sources: {
      openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': colors.mapBg } },
      {
        id: 'park',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: { 'fill-color': colors.mapWater, 'fill-opacity': 0.45 },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: { 'fill-color': colors.mapWater },
      },
      {
        id: 'waterway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'waterway',
        paint: { 'line-color': colors.mapWater, 'line-width': 1.5 },
      },
      {
        id: 'building',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        minzoom: 15,
        paint: { 'fill-color': colors.mapRoadSoft, 'fill-opacity': 0.5 },
      },
      {
        id: 'road-minor',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', ['get', 'class'], ['literal', MINOR_ROADS]],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': colors.mapRoadSoft,
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 15, 2, 18, 8],
        },
      },
      {
        id: 'road-major',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', ['get', 'class'], ['literal', MAJOR_ROADS]],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': colors.mapRoad,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.8, 13, 2, 16, 5, 18, 12],
        },
      },
    ],
  };
}

/** Zoom that frames a check-in circle the way the old map deltas did. */
export function zoomForRadius(radiusMeters: number) {
  const delta = Math.max((radiusMeters / 111000) * 6, 0.01);
  return Math.min(Math.max(Math.log2(360 / delta) + 0.45, 3), 18);
}

/** GeoJSON polygon approximating a circle of `radiusMeters` around a point. */
export function circlePolygon(lat: number, lng: number, radiusMeters: number, steps = 64): GeoJSON.Feature {
  const latRadius = radiusMeters / 111320;
  const lngRadius = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * 2 * Math.PI;
    ring.push([lng + lngRadius * Math.cos(angle), lat + latRadius * Math.sin(angle)]);
  }
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [ring] } };
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
