import type { IllustrationName } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { Doodle, type DoodleKind } from '@/components/ui/decor';
import { H2, Hand, Sub } from '@/components/ui/typography';
import { View } from 'react-native';

type EmptyStateProps = {
  title: string;
  detail?: string;
  action?: string;
  onPress?: () => void;
  /** Picks the doodle drawn above the message. */
  illustration?: IllustrationName;
  /** Optional handwritten aside under the message. */
  note?: string;
};

const doodleFor: Partial<Record<IllustrationName, DoodleKind>> = {
  'empty-wallet': 'ticket',
  'empty-visits': 'camera',
  'empty-review': 'camera',
  'empty-venues': 'pin',
  'empty-places': 'pin',
  'empty-perks': 'cocktail',
  'onb-capture': 'camera',
  'onb-owner': 'mug',
  'success-sent': 'heart',
};

export function EmptyState({ title, detail, action, onPress, illustration = 'onb-discover', note }: EmptyStateProps) {
  const kind = doodleFor[illustration] ?? 'compass';
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 36, gap: 10 }}>
      <View style={{ width: 120, height: 76, marginBottom: 6 }}>
        <Doodle kind={kind} size={58} style={{ left: 31, top: 8 }} />
        <Doodle kind="sparkle" size={18} accent style={{ right: 8, top: 0 }} />
        <Doodle kind="sparkle" size={10} style={{ left: 10, top: 40 }} />
      </View>
      <H2 size={22} style={{ textAlign: 'center' }}>
        {title}
      </H2>
      {detail ? <Sub style={{ textAlign: 'center', maxWidth: 300 }}>{detail}</Sub> : null}
      {note ? <Hand>{note}</Hand> : null}
      {action && onPress ? (
        <View style={{ marginTop: 10, alignSelf: 'stretch' }}>
          <Button label={action} onPress={onPress} />
        </View>
      ) : null}
    </View>
  );
}
