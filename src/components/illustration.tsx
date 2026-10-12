import { Doodle, Tape, type DoodleKind } from '@/components/ui/decor';
import { useSurfaces } from '@/theme/surfaces';
import { View } from 'react-native';

const scenes = {
  'onb-discover': 'compass',
  'onb-capture': 'camera',
  'onb-earn': 'ticket',
  'onb-owner': 'mug',
  'perm-location': 'pin',
  'perm-notify': 'bell',
  'empty-places': 'pin',
  'empty-venues': 'pin',
  'success-sent': 'heart',
  'empty-perks': 'cocktail',
  'empty-visits': 'camera',
  'empty-wallet': 'ticket',
  'empty-review': 'camera',
} as const satisfies Record<string, DoodleKind>;

export type IllustrationName = keyof typeof scenes;

type IllustrationProps = {
  name: IllustrationName;
  size?: number;
};

/** Journal-style hero: a taped card holding a big doodle, with sparkles in the margin. */
export function Illustration({ name, size = 240 }: IllustrationProps) {
  const { surfaces, isJournal } = useSurfaces();
  const card = Math.round(size * 0.56);
  const kind = scenes[name];

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: Math.round(size * 0.86), alignItems: 'center', justifyContent: 'center' }}>
      <Doodle kind="sparkle" size={Math.round(size * 0.1)} accent style={{ right: size * 0.1, top: size * 0.06 }} />
      <Doodle kind="sparkle" size={Math.round(size * 0.05)} style={{ right: size * 0.2, top: size * 0.2 }} />
      <Doodle kind="star" size={Math.round(size * 0.08)} rotate={-12} style={{ left: size * 0.08, top: size * 0.16 }} />
      <Doodle kind="squiggle" size={Math.round(size * 0.42)} style={{ left: size * 0.02, bottom: size * 0.04 }} />
      <Doodle kind="heart" size={Math.round(size * 0.08)} rotate={12} style={{ right: size * 0.08, bottom: size * 0.12 }} />
      <View
        style={[
          isJournal ? surfaces.raised : [surfaces.card, surfaces.liftShadow],
          {
            width: card,
            height: card,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: '-4deg' }],
          },
        ]}>
        <Doodle kind={kind} size={Math.round(card * 0.58)} accent style={{ position: 'relative' }} />
      </View>
      <Tape rotate={-6} style={{ top: size * 0.86 * 0.5 - card / 2 - 12, alignSelf: 'center' }} />
    </View>
  );
}
