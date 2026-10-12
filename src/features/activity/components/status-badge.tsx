import { Stamp } from '@/components/ui/decor';

type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const labels: Record<ReviewStatus, string> = {
  PENDING: 'Waiting',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const tones = { PENDING: 'wait', APPROVED: 'ok', REJECTED: 'no' } as const;

export function StatusBadge({ status, rotate = 0 }: { status: ReviewStatus; rotate?: number }) {
  return <Stamp label={labels[status]} tone={tones[status]} rotate={rotate} />;
}
