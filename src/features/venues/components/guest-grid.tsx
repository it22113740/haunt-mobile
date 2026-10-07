import { ListEnter } from '@/components/ui/enter';
import { MediaTile } from '@/components/ui/media-tile';
import type { GalleryItem } from '@/features/venues/schemas';
import { useWindowDimensions, View } from 'react-native';

export function GuestGrid({ items, onOpen }: { items: GalleryItem[]; onOpen: (item: GalleryItem) => void }) {
  const { width } = useWindowDimensions();
  const size = Math.floor((width - 48 - 16) / 3);

  return (
    <View className="mt-4 flex-row flex-wrap gap-2">
      {items.map((item, index) => (
        <ListEnter key={item.id} index={index}>
          <MediaTile uri={item.mediaUrl} kind={item.type} size={size} onPress={() => onOpen(item)} />
        </ListEnter>
      ))}
    </View>
  );
}
