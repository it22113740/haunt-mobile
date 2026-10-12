import { PressScale } from '@/components/ui/press-scale';
import { Polaroid, Tape } from '@/components/ui/decor';
import { ListEnter } from '@/components/ui/enter';
import { MediaTile } from '@/components/ui/media-tile';
import { Hand } from '@/components/ui/typography';
import type { GalleryItem } from '@/features/venues/schemas';
import { useSurfaces } from '@/theme/surfaces';
import { useWindowDimensions, View } from 'react-native';

const TILT = [-3, 2, -2, 3, -1, 2];

export function GuestGrid({
  items,
  onOpen,
  onCapture,
}: {
  items: GalleryItem[];
  onOpen: (item: GalleryItem) => void;
  onCapture: () => void;
}) {
  const { width } = useWindowDimensions();
  const { colors, isWhite } = useSurfaces();
  const gap = isWhite ? 12 : 8;
  const size = Math.floor((Math.min(width, 520) - 40 - gap * 2) / 3);
  const inner = isWhite ? size - 10 : size;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {isWhite && items.length > 0 ? (
        <>
          <Tape rotate={-6} style={{ top: -10, left: 16 }} />
          {items.length > 3 ? <Tape ash rotate={5} style={{ top: size + 6, right: 20 }} /> : null}
        </>
      ) : null}
      {items.map((item, index) => (
        <ListEnter key={item.id} index={index}>
          {isWhite ? (
            <Polaroid rotate={TILT[index % TILT.length]} style={{ width: size }}>
              <MediaTile
                uri={item.mediaUrl}
                kind={item.type}
                size={inner}
                radius={0}
                bordered={false}
                onPress={() => onOpen(item)}
              />
            </Polaroid>
          ) : (
            <MediaTile uri={item.mediaUrl} kind={item.type} size={size} onPress={() => onOpen(item)} />
          )}
        </ListEnter>
      ))}
      <PressScale
        accessibilityRole="button"
        accessibilityLabel="Capture a visit here"
        onPress={onCapture}
        style={{
          width: size,
          height: isWhite ? size + 11 : size,
          borderRadius: 6,
          borderWidth: isWhite ? 1 : 1.5,
          borderStyle: 'dashed',
          borderColor: colors.lineStrong,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Hand style={{ lineHeight: 20 }}>yours</Hand>
        <Hand style={{ lineHeight: 20 }}>next?</Hand>
      </PressScale>
    </View>
  );
}
