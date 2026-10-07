import Discover from '@/assets/illustrations/onb-discover.svg';
import Capture from '@/assets/illustrations/onb-capture.svg';
import Earn from '@/assets/illustrations/onb-earn.svg';
import Owner from '@/assets/illustrations/onb-owner.svg';
import Location from '@/assets/illustrations/perm-location.svg';
import Notify from '@/assets/illustrations/perm-notify.svg';
import Places from '@/assets/illustrations/empty-places.svg';
import Venues from '@/assets/illustrations/empty-venues.svg';
import Sent from '@/assets/illustrations/success-sent.svg';
import Perks from '@/assets/illustrations/empty-perks.svg';
import Review from '@/assets/illustrations/empty-review.svg';
import Visits from '@/assets/illustrations/empty-visits.svg';
import Wallet from '@/assets/illustrations/empty-wallet.svg';
import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

const illustrations = {
  'onb-discover': Discover,
  'onb-capture': Capture,
  'onb-earn': Earn,
  'onb-owner': Owner,
  'perm-location': Location,
  'perm-notify': Notify,
  'empty-places': Places,
  'empty-venues': Venues,
  'success-sent': Sent,
  'empty-perks': Perks,
  'empty-visits': Visits,
  'empty-wallet': Wallet,
  'empty-review': Review,
} as const;

export type IllustrationName = keyof typeof illustrations;

type IllustrationProps = {
  name: IllustrationName;
  size?: number;
};

export function Illustration({ name, size = 240 }: IllustrationProps) {
  const Graphic: FC<SvgProps> = illustrations[name];
  return <Graphic width={size} height={size} />;
}
