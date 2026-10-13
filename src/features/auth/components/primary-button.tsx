import { Button } from '@/components/ui/button';
import { useHuntTheme } from '@/theme/colors';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, loading, disabled }: PrimaryButtonProps) {
  const { isWhite } = useHuntTheme();
  return (
    <Button
      label={label}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      labelColor={isWhite ? '#FFFFFF' : undefined}
    />
  );
}
