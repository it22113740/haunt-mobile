import { CachedImage } from '@/components/cached-image';
import { Text, View } from 'react-native';

type AvatarProps = {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
};

export function initials(name?: string | null) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'H';
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '');
  return letters.join('') || 'H';
}

export function Avatar({ imageUrl, name, size = 40 }: AvatarProps) {
  if (imageUrl) {
    return (
      <CachedImage
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      className="items-center justify-center bg-haunt-blush"
      style={{ width: size, height: size, borderRadius: size / 2 }}>
      <Text className="font-display text-caption text-haunt-accent">{initials(name)}</Text>
    </View>
  );
}
