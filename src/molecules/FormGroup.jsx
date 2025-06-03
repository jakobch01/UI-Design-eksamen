import Label from "../atoms/Label";
import Input from "../atoms/Input";
import Text from "../atoms/Text"; // fx til hjælpetekst eller fejl

export default function FormGroup({ label, value, onChange, error, helper }) {
  return (
    <div className="w-full flex flex-col gap-1 sm:gap-2">
      <Label className="text-sm sm:text-base">{label}</Label>
      <Input
        className="w-full p-2 sm:p-3 rounded"
        value={value}
        onChange={onChange}
      />
      {helper && (
        <Text variant="helper" className="text-xs sm:text-sm text-gray-500">
          {helper}
        </Text>
      )}
      {error && (
        <Text variant="error" className="text-xs sm:text-sm text-red-500">
          {error}
        </Text>
      )}
    </div>
  );
}
