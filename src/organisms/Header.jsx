import Text from "../atoms/Text";
import Button from "../atoms/Button";

export default function Header({ user, onLogout }) {
  return (
    <header className="flex justify-between items-center bg-gray-800 text-white p-4 rounded">
      <Text variant="heading" className="text-2xl">
        Super User Panel
      </Text>
      <div className="flex items-center gap-4">
        <Text variant="label">
          Welcome, {user?.username} ({user?.role})
        </Text>
        <Button onClick={onLogout} className="bg-red-600 text-white">
          Logout
        </Button>
      </div>
    </header>
  );
}