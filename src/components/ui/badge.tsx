import { Stamp, type StampTone } from '@/components/ui/decor';

type BadgeTone = 'good' | 'danger' | 'warn' | 'neutral' | 'accent';

const stampTone: Record<BadgeTone, StampTone> = {
  good: 'ok',
  danger: 'no',
  warn: 'wait',
  accent: 'wait',
  neutral: 'used',
};

/** Status label rendered as a journal stamp. */
export function Badge({ label, tone = 'neutral', rotate = 0 }: { label: string; tone?: BadgeTone; rotate?: number }) {
  return <Stamp label={label} tone={stampTone[tone]} rotate={rotate} />;
}
