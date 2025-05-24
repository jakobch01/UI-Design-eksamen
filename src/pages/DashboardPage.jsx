import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToWarnings = () => {
    navigate("/warnings"); // Navigerer til din WarningsPage
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Velkommen, {user.username}</p>
      <button
        onClick={logout}
        className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded"
      >
        Log ud
      </button>
      <button
        onClick={goToWarnings}
        className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded"
      >
        Liste over advarsler
      </button>
    </div>
  );
}
