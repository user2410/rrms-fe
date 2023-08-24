import { Checkbox, Label } from "flowbite-react";

interface CheckboxInputProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string | React.ReactNode;
}
const CheckboxInput: React.FC<CheckboxInputProps> = ({
  id,
  checked,
  onChange,
  label,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onChange={onChange}/>
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

export default CheckboxInput;