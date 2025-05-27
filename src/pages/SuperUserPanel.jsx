import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "../auth/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import NumberCardWidget from "../components/NumberCardWidget";
import LineChartWidget from "../components/LineChartWidget";

export default function SuperUserPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { dashboards, addDashboard, addWidgetToDashboard, removeWidgetFromDashboard } = useDashboard();

  const [selectedDashboard, setSelectedDashboard] = useState(0);
  const [showWidgetForm, setShowWidgetForm] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [excelFile, setExcelFile] = useState(null);

  const handleExcelUpload = (e) => setExcelFile(e.target.files[0]);

  const createDashboard = () => {
    if (!newDashboardName.trim() || !excelFile) {
      alert("Please enter a dashboard name and select an Excel file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      const animalSheet = wb.Sheets["Animal data"];
      const visitSheet = wb.Sheets["Visit data"];

      if (!animalSheet || !visitSheet) {
        alert("Excel file must contain 'Animal data' and 'Visit data' sheets!");
        return;
      }

      const animalData = XLSX.utils.sheet_to_json(animalSheet);
      const visitData = XLSX.utils.sheet_to_json(visitSheet);

      const newDashboard = {
        name: newDashboardName,
        widgets: [],
        data: { animalData, visitData },
      };

      addDashboard(newDashboard);
      setNewDashboardName("");
      setExcelFile(null);
    };
    reader.readAsBinaryString(excelFile);
  };

  const [widgetForm, setWidgetForm] = useState({
    type: "Line Chart",
    metric: "Weight Gain Over Time",
    timePeriod: "Last 30 Days",
    pigGroup: "All",
    location: "All",
  });

  const handleFormChange = (e) =>
    setWidgetForm({ ...widgetForm, [e.target.name]: e.target.value });

  const addWidget = () => {
    let widgetToAdd = { ...widgetForm };

    const animalData = dashboards[selectedDashboard]?.data?.animalData || [];
    const visitData = dashboards[selectedDashboard]?.data?.visitData || [];

    if (widgetForm.type === "Number Card" && widgetForm.metric === "Number of pigs") {
      widgetToAdd.value = animalData.length;
    }

    if (widgetForm.type === "Line Chart" && widgetForm.metric === "Weight Gain Over Time") {
      const dataByLocation = {};

      visitData.forEach((visit) => {
        const animal = animalData.find(a => a["Responder"] === visit["Responder"]);
        const location = animal?.["Location"] || "Unknown";

        if (widgetForm.location !== "All" && location !== widgetForm.location) {
          return;
        }

        const excelDate = visit.Date;
        const jsDate = typeof excelDate === "number"
          ? new Date((excelDate - 25569) * 86400 * 1000).toISOString().split("T")[0]
          : excelDate || "Unknown Date";

        const weight = parseFloat(visit["Weight"]) || 0;

        if (!dataByLocation[location]) dataByLocation[location] = {};
        if (!dataByLocation[location][jsDate]) dataByLocation[location][jsDate] = { total: 0, count: 0 };

        dataByLocation[location][jsDate].total += weight;
        dataByLocation[location][jsDate].count += 1;
      });

      widgetToAdd.data = Object.entries(dataByLocation).flatMap(([location, dates]) =>
        Object.entries(dates).map(([date, { total, count }]) => ({
          group: location,
          date,
          value: count ? (total / count) : 0,
        }))
      );
    }

    addWidgetToDashboard(selectedDashboard, widgetToAdd);
    setShowWidgetForm(false);
  };

  const removeWidget = (index) => {
    removeWidgetFromDashboard(selectedDashboard, index);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <div className="flex gap-6">
        <aside className="w-64 bg-gray-700 rounded p-4">
          <h2 className="font-semibold text-sm uppercase mb-2 tracking-wider text-gray-300">
            Dashboards
          </h2>
          <ul className="space-y-2 mb-4">
            {dashboards.map((d, index) => (
              <li
                key={index}
                className={`p-2 rounded cursor-pointer ${
                  index === selectedDashboard
                    ? "bg-blue-600 font-bold"
                    : "hover:bg-gray-600"
                }`}
                onClick={() => setSelectedDashboard(index)}
              >
                {d.name}
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-semibold mb-2 text-gray-300">Create Dashboard</h3>
          <input
            type="text"
            placeholder="Dashboard name"
            value={newDashboardName}
            onChange={(e) => setNewDashboardName(e.target.value)}
            className="w-full p-2 text-sm mb-2 rounded text-black"
          />
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            className="text-sm mb-2"
          />
          <button
            onClick={createDashboard}
            className="w-full bg-blue-500 text-white text-sm py-1 rounded"
          >
            Create Dashboard
          </button>
        </aside>

        <main className="flex-1 bg-gray-700 rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {dashboards[selectedDashboard]?.name}
            </h2>
            <button
              onClick={() => setShowWidgetForm(!showWidgetForm)}
              className="bg-blue-500 text-sm px-3 py-1 rounded hover:bg-blue-600"
            >
              {showWidgetForm ? "Cancel" : "Add Widget"}
            </button>
          </div>

          {showWidgetForm && (
            <div className="bg-gray-600 p-4 rounded mb-6">
              <h3 className="font-semibold mb-2">Add Widget</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-black">
                <div>
                  <label className="block text-white text-sm mb-1">
                    Widget Type
                  </label>
                  <select
                    name="type"
                    value={widgetForm.type}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded"
                  >
                    <option>Line Chart</option>
                    <option>Bar Chart</option>
                    <option>Number Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">Metric</label>
                  <select
                    name="metric"
                    value={widgetForm.metric}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded"
                  >
                    <option>Feed Intake</option>
                    <option>Weight</option>
                    <option>Temperature</option>
                    <option>Number of pigs</option>
                    <option>Weight Gain Over Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={widgetForm.location}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded"
                    placeholder="All"
                  />
                </div>
              </div>
              <button
                onClick={addWidget}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Widget
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {dashboards[selectedDashboard]?.widgets.map((widget, idx) => (
              <div key={idx} className="relative">
                {widget.type === "Number Card" ? (
                  <NumberCardWidget title={widget.metric} value={widget.value} />
                ) : widget.type === "Line Chart" && widget.metric === "Weight Gain Over Time" ? (
                  <LineChartWidget title={widget.metric} data={widget.data} groupKey="group" />
                ) : (
                  <div className="bg-gray-600 p-4 rounded text-sm">
                    <p className="font-semibold">{widget.type}: {widget.metric}</p>
                  </div>
                )}
                <button
                  onClick={() => removeWidget(idx)}
                  className="absolute top-2 right-2 text-red-400 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
