import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import NumberCardWidget from "../components/NumberCardWidget";

export default function DashboardPage() {
  const { dashboards } = useDashboard();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToWarnings = () => {
    navigate("/warnings"); // Navigates to the warnings page
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="mb-4">
        Velkommen, {user.username} ({user.role})
      </p>

      {dashboards.length === 0 ? (
        <p>Ingen dashboards tilgængelige.</p>
      ) : (
        dashboards.map((d, idx) => (
          <div key={idx} className="bg-gray-200 p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-4">{d.name}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {d.widgets.length === 0 ? (
                <p className="text-sm text-gray-600">Ingen widgets tilføjet.</p>
              ) : (
                d.widgets.map((w, widx) =>
                  w.type === "Number Card" ? (
                    <NumberCardWidget
                      key={widx}
                      title={w.metric}
                      value={w.value}
                    />
                  ) : (
                    <div key={widx} className="bg-gray-300 p-3 rounded">
                      <p className="font-semibold">
                        {w.type}: {w.metric}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {w.timePeriod} | {w.pigGroup}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        ))
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={logout}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded"
        >
          Log ud
        </button>

        <button
          onClick={goToWarnings}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded"
        >
          Liste over advarsler
        </button>
      </div>
    </div>
  );
}
