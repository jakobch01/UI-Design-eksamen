import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "../auth/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import NumberCardWidget from "../components/NumberCardWidget";
import BarChartWidget from "../components/BarChartWidget";
import LineChartWidget from "../components/LineChartWidget";
import UnderfedPigsWidget from "../components/UnderfedPigsWidget";

export default function SuperUserPanel() {
  const navigate = useNavigate();
  const { logout, createUser } = useAuth();
  const { dashboards, addDashboard, addWidgetToDashboard, removeWidgetFromDashboard } = useDashboard();

  const [selectedDashboard, setSelectedDashboard] = useState(0);
  const [showWidgetForm, setShowWidgetForm] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });

  const [widgetForm, setWidgetForm] = useState({
    type: "Number Card",
    metric: "",
  });

  const metricOptions = {
    "Number Card": ["Number of pigs"],
    "Bar Chart": ["Feed Efficiency by Location"],
    "Line Chart": ["Average Feed Intake per Pig"],
    "List": ["Underfed Pigs"],
  };

  const handleExcelUpload = (e) => setExcelFile(e.target.files[0]);

  const createDashboard = () => {
    if (!newDashboardName.trim() || !excelFile) {
      alert("Please enter a dashboard name and select an Excel file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const animalData = XLSX.utils.sheet_to_json(wb.Sheets["Animal data"] || {});
      const visitData = XLSX.utils.sheet_to_json(wb.Sheets["Visit data"] || {});

      if (!animalData.length || !visitData.length) {
        alert("Excel file must contain 'Animal data' and 'Visit data' sheets!");
        return;
      }

      addDashboard({ name: newDashboardName, widgets: [], data: { animalData, visitData } });
      setNewDashboardName("");
      setExcelFile(null);
    };
    reader.readAsBinaryString(excelFile);
  };

  const handleFormChange = (e) => setWidgetForm({ ...widgetForm, [e.target.name]: e.target.value });

  const addWidget = () => {
    let widgetToAdd = { ...widgetForm };
    const animalData = dashboards[selectedDashboard]?.data?.animalData || [];
    const visitData = dashboards[selectedDashboard]?.data?.visitData || [];

    const validAnimals = animalData.filter((a) => {
      const weightGain = parseFloat(a["Weight gain (kg)"]) || 0;
      const daysInTest = parseFloat(a["Completed days in test"]) || 0;
      return weightGain > 0 && daysInTest >= 0;
    });

    if (widgetForm.type === "Number Card" && widgetForm.metric === "Number of pigs") {
      widgetToAdd.value = validAnimals.length;
    }

    if (widgetForm.metric === "Underfed Pigs") {
      const underfedThreshold = 0.5;
      widgetToAdd.data = validAnimals
        .map((animal) => {
          const responder = animal["Responder"];
          const location = animal["Location"] || "Unknown";
          const weightGain = parseFloat(animal["Weight gain (kg)"]) || 0;
          const visits = visitData.filter((visit) => visit["Responder"] === responder);
          const totalFeed = visits.reduce((sum, visit) => sum + (parseFloat(visit["Feed amount (g)"]) || 0), 0);
          return {
            responder,
            location,
            totalFeed: totalFeed.toFixed(2),
            weightGain: weightGain.toFixed(2),
            gainPerDay: weightGain / (parseFloat(animal["Completed days in test"]) || 1),
          };
        })
        .filter((pig) => pig.gainPerDay < underfedThreshold);
    }

    if (widgetForm.type === "Bar Chart" && widgetForm.metric === "Feed Efficiency by Location") {
      const efficiencyByLocation = {};
      validAnimals.forEach((animal) => {
        const location = animal["Location"] || "Unknown";
        const weightGain = parseFloat(animal["Weight gain (kg)"]) || 0;
        const visits = visitData.filter((visit) => visit["Responder"] === animal["Responder"]);
        const totalFeed = visits.reduce((sum, visit) => sum + (parseFloat(visit["Feed amount (g)"]) || 0), 0);

        if (!efficiencyByLocation[location]) {
          efficiencyByLocation[location] = { totalFeed: 0, totalWeightGain: 0 };
        }
        efficiencyByLocation[location].totalFeed += totalFeed;
        efficiencyByLocation[location].totalWeightGain += weightGain;
      });

      widgetToAdd.data = Object.entries(efficiencyByLocation).map(([location, values]) => ({
        location,
        efficiency: values.totalWeightGain > 0 ? values.totalFeed / values.totalWeightGain : 0,
      }));
    }

    if (widgetForm.type === "Line Chart" && widgetForm.metric === "Average Feed Intake per Pig") {
      const feedByDate = {};
      visitData.forEach((visit) => {
        const responder = visit["Responder"];
        const animal = validAnimals.find((a) => a["Responder"] === responder);
        if (!animal) return;
        const excelDate = visit.Date;
        const jsDate = typeof excelDate === "number" ? new Date((excelDate - 25569) * 86400 * 1000) : new Date(excelDate);
        const dateKey = jsDate.toISOString().split("T")[0];
        const feedAmount = parseFloat(visit["Feed amount (g)"]) || 0;

        if (!feedByDate[dateKey]) feedByDate[dateKey] = { totalFeed: 0, count: 0 };
        feedByDate[dateKey].totalFeed += feedAmount;
        feedByDate[dateKey].count += 1;
      });

      widgetToAdd.data = Object.entries(feedByDate).map(([date, values]) => ({
        date,
        value: values.count ? values.totalFeed / values.count : 0,
      }));
    }

    addWidgetToDashboard(selectedDashboard, widgetToAdd);
    setShowWidgetForm(false);
  };

  const handleUserInputChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password) {
      alert("Please enter username and password");
      return;
    }
    createUser(newUser);
    setNewUser({ username: "", password: "", role: "user" });
  };

  const removeWidget = (index) => removeWidgetFromDashboard(selectedDashboard, index);

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide">Super User Panel</h1>
        <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </header>

      <div className="flex gap-6">
        <aside className="w-64 bg-gray-700 rounded p-4">
          <h2 className="font-semibold text-sm uppercase mb-2 tracking-wider text-gray-300">Dashboards</h2>
          <ul className="space-y-2 mb-4">
            {dashboards.map((d, index) => (
              <li key={index} className={`p-2 rounded cursor-pointer ${index === selectedDashboard ? "bg-blue-600 font-bold" : "hover:bg-gray-600"}`} onClick={() => setSelectedDashboard(index)}>
                {d.name}
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-semibold mb-2 text-gray-300">Create Dashboard</h3>
          <input type="text" placeholder="Dashboard name" value={newDashboardName} onChange={(e) => setNewDashboardName(e.target.value)} className="w-full p-2 text-sm mb-2 rounded text-black" />
          <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="text-sm mb-2" />
          <button onClick={createDashboard} className="w-full bg-blue-500 text-white text-sm py-1 rounded">Create Dashboard</button>

          <h3 className="text-sm font-semibold mt-6 mb-2 text-gray-300">Create User</h3>
          <input type="text" placeholder="Username" name="username" value={newUser.username} onChange={handleUserInputChange} className="w-full p-2 text-sm mb-2 rounded text-black" />
          <input type="password" placeholder="Password" name="password" value={newUser.password} onChange={handleUserInputChange} className="w-full p-2 text-sm mb-2 rounded text-black" />
          <select name="role" value={newUser.role} onChange={handleUserInputChange} className="w-full p-2 text-sm mb-2 rounded text-black">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleCreateUser} className="w-full bg-green-500 text-white text-sm py-1 rounded">Create User</button>
        </aside>

        <main className="flex-1 bg-gray-700 rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{dashboards[selectedDashboard]?.name}</h2>
            <button onClick={() => setShowWidgetForm(!showWidgetForm)} className="bg-blue-500 text-sm px-3 py-1 rounded hover:bg-blue-600">{showWidgetForm ? "Cancel" : "Add Widget"}</button>
          </div>

          {showWidgetForm && (
            <div className="bg-gray-600 p-4 rounded mb-6">
              <h3 className="font-semibold mb-2">Add Widget</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-black">
                <div>
                  <label className="block text-white text-sm mb-1">Widget Type</label>
                  <select name="type" value={widgetForm.type} onChange={handleFormChange} className="w-full p-2 rounded">
                    {Object.keys(metricOptions).map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">Metric</label>
                  <select name="metric" value={widgetForm.metric} onChange={handleFormChange} className="w-full p-2 rounded">
                    <option value="">Select metric</option>
                    {metricOptions[widgetForm.type]?.map((metric) => (
                      <option key={metric}>{metric}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={addWidget} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save Widget</button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {dashboards[selectedDashboard]?.widgets.map((widget, idx) => (
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
                <button onClick={() => removeWidget(idx)} className="absolute top-2 right-2 text-red-400 text-xs">Remove</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
