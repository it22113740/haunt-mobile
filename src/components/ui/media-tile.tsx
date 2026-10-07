import { CachedImage } from '@/components/cached-image';
import { Play } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type MediaTileProps = {
  uri?: string | null;
  kind: 'PHOTO' | 'VIDEO';
  onPress?: () => void;
  size?: number;
  width?: number;
  height?: number;
};

export function MediaTile({ uri, kind, onPress, size = 72, width, height }: MediaTileProps) {
  const tileWidth = width ?? size;
  const tileHeight = height ?? size;
  const radius = 16;
  const frame =
    kind === 'PHOTO' && uri ? (
      <CachedImage
        source={{ uri }}
        style={{ width: tileWidth, height: tileHeight, borderRadius: radius }}
        contentFit="cover"
      />
    ) : (
      <View style={{ width: tileWidth, height: tileHeight, borderRadius: radius, backgroundColor: '#161210' }} />
    );

  const body = (
    <View>
      {frame}
      {kind === 'VIDEO' ? (
        <View
          pointerEvents="none"
          className="absolute items-center justify-center"
          style={{ width: tileWidth, height: tileHeight, borderRadius: radius }}>
          <Play color="#FFFCF8" size={18} />
        </View>
      ) : null}
    </View>
  );

  if (!onPress) return body;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={kind === 'PHOTO' ? 'Open photo' : 'Play video'} onPress={onPress}>
      {body}
    </Pressable>
  );
}
