import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import NumberCardWidget from "../components/NumberCardWidget";

export default function DashboardPage() {
  const { dashboards } = useDashboard();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToWarnings = () => {
    navigate("/warnings");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4B4B4B] px-4 py-8">
      <div className="max-w-4xl w-full p-6 bg-white rounded shadow-lg">
        <h1 className="text-gray-900 font-bold mb-6 text-center text-3xl">
          Dashboard for {user.username}
        </h1>

        {dashboards.length === 0 ? (
          <p className="text-gray-700 text-center">Ingen dashboards tilgængelige.</p>
        ) : (
          dashboards.map((d, idx) => (
            <div key={idx} className="bg-gray-100 p-5 rounded mb-8 shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">{d.name}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      <div key={widx} className="bg-gray-200 p-4 rounded">
                        <p className="font-semibold text-gray-800">
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

        <div className="flex gap-6 mt-8">
          <button
            onClick={logout}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-2 rounded hover:from-gray-800 hover:to-black transition"
          >
            Log ud
          </button>

          <button
            onClick={goToWarnings}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded hover:from-red-700 hover:to-red-900 transition"
          >
            Vis advarsler
          </button>
        </div>
      </div>
    </div>
  );
}
