import { Segmented } from '@/components/ui/controls';
import { Label } from '@/components/ui/typography';
import { View } from 'react-native';

type Role = 'USER' | 'OWNER';

type RoleSwitchProps = {
  value: Role;
  onChange: (role: Role) => void;
};

const options: { value: Role; label: string }[] = [
  { value: 'USER', label: 'Explorer' },
  { value: 'OWNER', label: 'Business' },
];

export function RoleSwitch({ value, onChange }: RoleSwitchProps) {
  return (
    <View style={{ gap: 4 }}>
      <Label>I’m joining as</Label>
      <Segmented options={options} value={value} onChange={onChange} />
    </View>
  );
}
