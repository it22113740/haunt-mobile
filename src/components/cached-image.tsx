import { Image, type ImageProps } from 'expo-image';

export function CachedImage({ cachePolicy = 'memory-disk', transition = 200, ...props }: ImageProps) {
  return <Image cachePolicy={cachePolicy} transition={transition} {...props} />;
}
