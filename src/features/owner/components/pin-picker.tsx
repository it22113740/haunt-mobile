import { PinPickerFrame, type PinPickerProps } from '@/features/owner/components/pin-picker-frame';
import { SketchMap } from '@/features/venues/components/sketch-map';

export function PinPicker({ lat, lng, onChange }: PinPickerProps) {
  return (
    <PinPickerFrame lat={lat} lng={lng} onChange={onChange} typedByDefault>
      <SketchMap height={230} />
    </PinPickerFrame>
  );
}
