import { CachedImage } from '@/components/cached-image';
import { useSurfaces } from '@/theme/surfaces';
import { Text, View } from 'react-native';

type AvatarProps = {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
  /** Solid orange disc (used on the dark photo viewer). */
  accent?: boolean;
};

export function initials(name?: string | null) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'H';
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '');
  return letters.join('') || 'H';
}

export function Avatar({ imageUrl, name, size = 40, accent = false }: AvatarProps) {
  const { colors, surfaces } = useSurfaces();
  const frame = [
    surfaces.avatar,
    { width: size, height: size, borderRadius: size / 2, overflow: 'hidden' as const },
    accent ? { backgroundColor: colors.accent, borderWidth: 0 } : null,
  ];

  if (imageUrl) {
    return (
      <View style={frame}>
        <CachedImage source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      </View>
    );
  }

  return (
    <View style={[frame, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text
        style={{
          fontFamily: 'BricolageGrotesque_700Bold',
          fontSize: Math.round(size * (size >= 64 ? 0.405 : 0.375)),
          color: colors.ink,
        }}>
        {initials(name)}
      </Text>
    </View>
  );
}
