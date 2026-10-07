import { Badge } from '@/components/ui/badge';

type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const labels: Record<ReviewStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const tones = { PENDING: 'warn', APPROVED: 'good', REJECTED: 'danger' } as const;

export function StatusBadge({ status }: { status: ReviewStatus }) {
  return <Badge label={labels[status]} tone={tones[status]} />;
}
