import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type HuntIconProps = { color: ColorValue; size?: number; strokeWidth?: number };

function Frame({
  color,
  size = 22,
  strokeWidth = 1.8,
  children,
}: HuntIconProps & { children: React.ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round">
      {children}
    </Svg>
  );
}

export function ExploreIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="m15.5 8.5-2 5-5 2 2-5z" />
    </Frame>
  );
}

export function OffersIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Path d="M4 10v4h3l7 4V6L7 10z" />
      <Path d="M18 9a4 4 0 0 1 0 6" />
    </Frame>
  );
}

export function CameraIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <Circle cx={12} cy={13} r={3.5} />
    </Frame>
  );
}

export function WalletIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Path d="M4 7h14a2 2 0 0 1 2 2v9H4z" />
      <Path d="M4 7l11-3v3" />
      <Circle cx={16} cy={13} r={1.2} />
    </Frame>
  );
}

export function LogIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7v5l3 2" />
    </Frame>
  );
}

export function PlacesIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Path d="M4 10h16M5 10l1-5h12l1 5M6 10v9h12v-9" />
      <Path d="M10 19v-5h4v5" />
    </Frame>
  );
}

export function ReviewIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Rect x={5} y={4} width={14} height={17} rx={1} />
      <Path d="m9 13 2 2 4-4" />
    </Frame>
  );
}

export function PerksIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Rect x={4} y={9} width={16} height={11} />
      <Path d="M3 9h18M12 9v11M12 9c-1.5-3-5-4-5-1.5S10 9 12 9c2 0 5-.5 5-1.5S13.5 6 12 9" />
    </Frame>
  );
}

export function CodesIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" />
      <Path d="M14 8v8" strokeDasharray="2 2" />
    </Frame>
  );
}

export function PinIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" />
      <Circle cx={12} cy={10} r={2.5} />
    </Frame>
  );
}

export function GlassIcon(props: HuntIconProps) {
  return (
    <Frame strokeWidth={1.6} {...props}>
      <Path d="M7 4h10l-1 7a4 4 0 0 1-8 0zM12 15v5M8 20h8" />
    </Frame>
  );
}

export function ImageIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Rect x={3} y={5} width={18} height={14} rx={1} />
      <Circle cx={9} cy={10} r={1.6} />
      <Path d="m21 16-5-5-8 8" />
    </Frame>
  );
}

export function VideoIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Rect x={3} y={6} width={13} height={12} rx={1} />
      <Path d="m16 10 5-3v10l-5-3" />
    </Frame>
  );
}

export function LibraryIcon(props: HuntIconProps) {
  return (
    <Frame {...props}>
      <Rect x={3} y={4} width={18} height={16} rx={1} />
      <Circle cx={9} cy={10} r={2} />
      <Path d="m21 16-5-5-9 9" />
    </Frame>
  );
}
