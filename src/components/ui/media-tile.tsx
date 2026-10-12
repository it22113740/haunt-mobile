import { PressScale } from '@/components/ui/press-scale';
import { CachedImage } from '@/components/cached-image';
import { useSurfaces } from '@/theme/surfaces';
import { Play } from 'lucide-react-native';
import { View } from 'react-native';

type MediaTileProps = {
  uri?: string | null;
  kind: 'PHOTO' | 'VIDEO';
  onPress?: () => void;
  size?: number;
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  bordered?: boolean;
};

export function MediaTile({
  uri,
  kind,
  onPress,
  size = 52,
  width,
  height,
  radius = 6,
  bordered = true,
}: MediaTileProps) {
  const { colors, surfaces } = useSurfaces();
  const tileWidth = width ?? size;
  const tileHeight = height ?? size;

  const body = (
    <View
      style={[
        { width: tileWidth, height: tileHeight, borderRadius: radius, overflow: 'hidden', backgroundColor: colors.ink },
        bordered ? surfaces.image : null,
      ]}>
      {kind === 'PHOTO' && uri ? (
        <CachedImage source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      ) : null}
      {kind === 'VIDEO' ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Play color={colors.ink} fill={colors.ink} size={12} />
          </View>
        </View>
      ) : null}
    </View>
  );

  if (!onPress) return body;

  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={kind === 'PHOTO' ? 'Open photo' : 'Play video'}
      onPress={onPress}
      >
      {body}
    </PressScale>
  );
}
