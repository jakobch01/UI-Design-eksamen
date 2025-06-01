import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../auth/AuthContext";
import NumberCardWidget from "../components/NumberCardWidget";
import BarChartWidget from "../components/BarChartWidget";
import LineChartWidget from "../components/LineChartWidget";
import UnderfedPigsWidget from "../components/UnderfedPigsWidget";

export default function DashboardPage() {
  const { dashboards } = useDashboard();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedDashboard, setSelectedDashboard] = useState(0);

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide">Dashboard</h1>
        <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </header>

      <div className="flex gap-6">
        <aside className="w-64 bg-gray-700 rounded p-4">
          <h2 className="font-semibold text-sm uppercase mb-2 tracking-wider text-gray-300">Dashboards</h2>
          <ul className="space-y-2 mb-4">
            {dashboards.map((d, index) => (
              <li
                key={index}
                className={`p-2 rounded cursor-pointer ${index === selectedDashboard ? "bg-blue-600 font-bold" : "hover:bg-gray-600"}`}
                onClick={() => setSelectedDashboard(index)}
              >
                {d.name}
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-semibold mt-6 text-gray-300">Bruger Info</h3>
          <p className="text-sm mt-1 text-gray-200">{user.username} ({user.role})</p>

          <button
            onClick={() => navigate("/warnings")}
            className="w-full mt-4 bg-blue-500 text-white text-sm py-1 rounded"
          >
            Se advarsler
          </button>
        </aside>

        <main className="flex-1 bg-gray-700 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">{dashboards[selectedDashboard]?.name || "Ingen dashboards"}</h2>

          {dashboards[selectedDashboard]?.widgets?.length === 0 ? (
            <p className="text-gray-300 text-sm">Ingen widgets tilgængelige i dette dashboard.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {dashboards[selectedDashboard].widgets.map((widget, idx) => (
                <div key={idx} className="relative">
                  {widget.type === "Number Card" ? (
                    <NumberCardWidget title={widget.metric} value={widget.value} />
                  ) : widget.type === "Bar Chart" ? (
                    <BarChartWidget title={widget.metric} data={widget.data} />
                  ) : widget.type === "Line Chart" ? (
                    <LineChartWidget title={widget.metric} data={widget.data} groupKey="date" />
                  ) : widget.metric === "Underfed Pigs" ? (
                    <UnderfedPigsWidget data={widget.data} />
                  ) : (
                    <div className="bg-gray-600 p-4 rounded text-sm">
                      <p className="font-semibold">{widget.type}: {widget.metric}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
