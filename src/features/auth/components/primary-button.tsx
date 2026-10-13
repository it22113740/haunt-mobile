import { Button } from '@/components/ui/button';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, loading, disabled }: PrimaryButtonProps) {
  return <Button label={label} onPress={onPress} loading={loading} disabled={disabled} />;
}
