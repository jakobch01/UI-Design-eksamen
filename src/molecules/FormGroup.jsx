import Label from "../atoms/Label";
import Input from "../atoms/Input";
import Text from "../atoms/Text"; // fx til hjælpetekst eller fejl

export default function FormGroup({ label, value, onChange, error, helper }) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} />
      {helper && <Text variant="helper">{helper}</Text>}
      {error && <Text variant="error" className="text-red-500">{error}</Text>}
    </div>
  );
}