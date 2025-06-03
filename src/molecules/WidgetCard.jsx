import Text from "../atoms/Text";
import Button from "../atoms/Button";

export default function WidgetCard({ title, children, onRemove }) {
  return (
    <div className="bg-gray-600 p-4 rounded shadow relative">
      <Text variant="title" className="text-xl font-semibold">{title}</Text>

      <div className="mt-2">{children}</div>

      {onRemove && (
        <Button
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-400 text-xs"
        >
          Remove
        </Button>
      )}
    </div>
  );
}