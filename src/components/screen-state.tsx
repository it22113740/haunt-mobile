import { EmptyState } from '@/components/empty-state';
import { SkeletonScreen, type SkeletonShape } from '@/components/skeleton';
import { ScreenEnter } from '@/components/ui/enter';
import type { ReactNode } from 'react';

type ScreenStateProps = {
  title: string;
  detail?: string;
  action?: string;
  onPress?: () => void;
  loading?: boolean;
  skeleton?: SkeletonShape;
  children?: ReactNode;
};

export function ScreenState({ title, detail, action, onPress, loading, skeleton = 'venue', children }: ScreenStateProps) {
  if (loading) return <SkeletonScreen label={title} shape={skeleton} />;

  return (
    <ScreenEnter className="flex-1 items-center justify-center bg-hunt-paper">
      <EmptyState title={title} detail={detail} action={action} onPress={onPress} />
      {children}
    </ScreenEnter>
  );
}
