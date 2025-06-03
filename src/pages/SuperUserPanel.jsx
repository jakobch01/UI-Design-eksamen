// src/pages/SuperUserPanel.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "../auth/AuthContext";
import { useDashboard } from "../context/DashboardContext";

import SuperUserPanelTemplate from "../templates/SuperUserPanelTemplate";

export default function SuperUserPanel() {
  const navigate = useNavigate();
  const { logout, createUser } = useAuth();
  const {
    dashboards,
    addDashboard,
    addWidgetToDashboard,
    removeWidgetFromDashboard,
  } = useDashboard();

  const [selectedDashboard, setSelectedDashboard] = useState(0);
  const [showWidgetForm, setShowWidgetForm] = useState(false);

  // --- Sidebar state ---
  const [newDashboardName, setNewDashboardName] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });

  // --- Widget-form state ---
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

  // --- Sidebar handlers ---
  const handleExcelUpload = (e) => setExcelFile(e.target.files[0]);

  const createDashboard = () => {
    if (!newDashboardName.trim() || !excelFile) {
      alert("Please enter a dashboard name and select an Excel file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const animalData = XLSX.utils.sheet_to_json(
        wb.Sheets["Animal data"] || {}
      );
      const visitData = XLSX.utils.sheet_to_json(
        wb.Sheets["Visit data"] || {}
      );

      if (!animalData.length || !visitData.length) {
        alert(
          "Excel file must contain 'Animal data' and 'Visit data' sheets!"
        );
        return;
      }

      addDashboard({
        name: newDashboardName,
        widgets: [],
        data: { animalData, visitData },
      });
      setNewDashboardName("");
      setExcelFile(null);
    };
    reader.readAsBinaryString(excelFile);
  };

  const handleUserInputChange = (e) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password) {
      alert("Please enter username and password");
      return;
    }
    createUser(newUser);
    setNewUser({ username: "", password: "", role: "user" });
  };

  // --- Widget-form handlers ---
  const handleFormChange = (e) =>
    setWidgetForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddWidget = () => {
    let widgetToAdd = { ...widgetForm };
    const animalData =
      dashboards[selectedDashboard]?.data?.animalData || [];
    const visitData =
      dashboards[selectedDashboard]?.data?.visitData || [];

    // Filtrer ugyldige dyr væk:
    const validAnimals = animalData.filter((a) => {
      const weightGain = parseFloat(a["Weight gain (kg)"]) || 0;
      const daysInTest = parseFloat(a["Completed days in test"]) || 0;
      return weightGain > 0 && daysInTest >= 0;
    });

    // --- Number Card ---
    if (
      widgetForm.type === "Number Card" &&
      widgetForm.metric === "Number of pigs"
    ) {
      widgetToAdd.value = validAnimals.length;
    }

    // --- LISTE: Underfed Pigs ---
    if (
      widgetForm.type === "List" &&
      widgetForm.metric === "Underfed Pigs"
    ) {
      const underfedThreshold = 0.5;
      widgetToAdd.data = validAnimals
        .map((animal) => {
          const responder = animal["Responder"];
          const location = animal["Location"] || "Unknown";
          const weightGain = parseFloat(animal["Weight gain (kg)"]) || 0;
          const daysInTest =
            parseFloat(animal["Completed days in test"]) || 1;
          const visits = visitData.filter(
            (v) => v["Responder"] === responder
          );
          const totalFeed = visits.reduce(
            (sum, v) => sum + (parseFloat(v["Feed amount (g)"]) || 0),
            0
          );
          const gainPerDay = weightGain / daysInTest;

          console.log(
            `Responder ${responder}: gainPerDay = ${gainPerDay.toFixed(2)}`
          );

          return {
            responder,
            location,
            totalFeed: totalFeed.toFixed(2),
            weightGain: weightGain.toFixed(2),
            gainPerDay,
          };
        })
        .filter((pig) => pig.gainPerDay < underfedThreshold);

      console.log(
        "Underfed pigs (før filtrering):",
        validAnimals.length
      );
      console.log(
        "Underfed pigs (efter filtrering):",
        widgetToAdd.data.length,
        widgetToAdd.data
      );
    }

    // --- Bar Chart: Feed Efficiency by Location ---
    if (
      widgetForm.type === "Bar Chart" &&
      widgetForm.metric === "Feed Efficiency by Location"
    ) {
      const efficiencyByLocation = {};
      validAnimals.forEach((animal) => {
        const location = animal["Location"] || "Unknown";
        const weightGain = parseFloat(animal["Weight gain (kg)"]) || 0;
        const visits = visitData.filter(
          (v) => v["Responder"] === animal["Responder"]
        );
        const totalFeed = visits.reduce(
          (sum, v) => sum + (parseFloat(v["Feed amount (g)"]) || 0),
          0
        );

        if (!efficiencyByLocation[location]) {
          efficiencyByLocation[location] = {
            totalFeed: 0,
            totalWeightGain: 0,
          };
        }
        efficiencyByLocation[location].totalFeed += totalFeed;
        efficiencyByLocation[location].totalWeightGain += weightGain;
      });

      widgetToAdd.data = Object.entries(efficiencyByLocation).map(
        ([location, vals]) => ({
          location,
          efficiency:
            vals.totalWeightGain > 0
              ? vals.totalFeed / vals.totalWeightGain
              : 0,
        })
      );
    }

    // --- Line Chart: Average Feed Intake per Pig ---
    if (
      widgetForm.type === "Line Chart" &&
      widgetForm.metric === "Average Feed Intake per Pig"
    ) {
      const feedByDate = {};
      visitData.forEach((visit) => {
        const responder = visit["Responder"];
        const animal = validAnimals.find(
          (a) => a["Responder"] === responder
        );
        if (!animal) return;
        const excelDate = visit.Date;
        const jsDate =
          typeof excelDate === "number"
            ? new Date((excelDate - 25569) * 86400 * 1000)
            : new Date(excelDate);
        const dateKey = jsDate.toISOString().split("T")[0];
        const feedAmt = parseFloat(visit["Feed amount (g)"]) || 0;

        if (!feedByDate[dateKey])
          feedByDate[dateKey] = { totalFeed: 0, count: 0 };
        feedByDate[dateKey].totalFeed += feedAmt;
        feedByDate[dateKey].count += 1;
      });

      widgetToAdd.data = Object.entries(feedByDate).map(
        ([date, vals]) => ({
          date,
          value: vals.count ? vals.totalFeed / vals.count : 0,
        })
      );
    }

    addWidgetToDashboard(selectedDashboard, widgetToAdd);
    setShowWidgetForm(false);
  };

  // --- Fjern widget handler ---
  const removeWidget = (idx) => {
    removeWidgetFromDashboard(selectedDashboard, idx);
  };

  return (
    <SuperUserPanelTemplate
      dashboards={dashboards}
      selectedDashboard={selectedDashboard}
      setSelectedDashboard={setSelectedDashboard}
      // Sidebar props
      newDashboardName={newDashboardName}
      setNewDashboardName={setNewDashboardName}
      handleExcelUpload={handleExcelUpload}
      createDashboard={createDashboard}
      newUser={newUser}
      handleUserInputChange={handleUserInputChange}
      handleCreateUser={handleCreateUser}
      // Widget-form props
      widgetForm={widgetForm}
      handleFormChange={handleFormChange}
      handleAddWidget={handleAddWidget}
      // Øvrige props
      logout={logout}
      removeWidget={removeWidget}
      showWidgetForm={showWidgetForm}
      toggleWidgetForm={() => setShowWidgetForm((prev) => !prev)}
    />
  );
}
