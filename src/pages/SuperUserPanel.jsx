import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "../auth/AuthContext";

export default function SuperUserPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [dashboards, setDashboards] = useState([
    { name: "Dashboard 1", widgets: [], data: { animalData: [], visitData: [] } },
  ]);
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

      setDashboards([...dashboards, newDashboard]);
      setNewDashboardName("");
      setExcelFile(null);
    };
    reader.readAsBinaryString(excelFile);
  };

  const [widgetForm, setWidgetForm] = useState({
    type: "Line Chart",
    metric: "Feed Intake",
    timePeriod: "Last 30 Days",
    pigGroup: "All",
    color: "Feed Consumption",
  });

  const handleFormChange = (e) =>
    setWidgetForm({ ...widgetForm, [e.target.name]: e.target.value });

  const addWidget = () => {
    const updated = [...dashboards];
    updated[selectedDashboard].widgets.push({ ...widgetForm });
    setDashboards(updated);
    setShowWidgetForm(false);
  };

  const removeWidget = (index) => {
    const updated = [...dashboards];
    updated[selectedDashboard].widgets.splice(index, 1);
    setDashboards(updated);
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
        {/* Sidebar */}
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

          {/* New Dashboard Form */}
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

        {/* Main Panel */}
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

          {/* Widget Form */}
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
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">
                    Time Period
                  </label>
                  <select
                    name="timePeriod"
                    value={widgetForm.timePeriod}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded"
                  >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">
                    Pig Group
                  </label>
                  <select
                    name="pigGroup"
                    value={widgetForm.pigGroup}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded"
                  >
                    <option>All</option>
                    <option>Young Pigs</option>
                    <option>Breeding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={widgetForm.color}
                    onChange={handleFormChange}
                    className="w-full p-2 rounded"
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

          {/* Widget List */}
          <div className="grid md:grid-cols-2 gap-4">
            {dashboards[selectedDashboard]?.widgets.map((widget, idx) => (
              <div
                key={idx}
                className="bg-gray-600 p-4 rounded text-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{widget.type}: {widget.metric}</p>
                  <p className="text-gray-300 text-xs">
                    {widget.timePeriod} | {widget.pigGroup}
                  </p>
                </div>
                <button
                  onClick={() => removeWidget(idx)}
                  className="text-red-400"
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
