import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "../auth/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import SuperUserPanelTemplate from "../templates/SuperUserPanelTemplate";

// Utility functions moved to a separate file, e.g. ../utils/dataProcessing.js
import {
  parseExcelFile,
  filterValidAnimals,
  calculateNumberOfPigs,
  getUnderfedPigs,
  getFeedEfficiencyByLocation,
  getAverageFeedIntakePerDay,
} from "../utils/dataProcessing";

export default function SuperUserPanel() {
  const navigate = useNavigate();
  const { logout, createUser } = useAuth();
  const {
    dashboards,
    addDashboard,
    addWidgetToDashboard,
    removeWidgetFromDashboard,
  } = useDashboard();

  // --- Dashboard Selection ---
  const [selectedDashboard, setSelectedDashboard] = useState(0);

  // --- Sidebar State ---
  const [newDashboardName, setNewDashboardName] = useState("");
  const [excelFile, setExcelFile] = useState(null);

  // user‐creation form
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });

  // --- Widget‐Form State ---
  const [showWidgetForm, setShowWidgetForm] = useState(false);
  const widgetFormToggleRef = useRef(null);

  const [widgetForm, setWidgetForm] = useState({
    type: "Number Card",
    metric: "",
  });

  // Define which metrics are available for each widget type
  const metricOptions = useMemo(
    () => ({
      "Number Card": ["Number of pigs"],
      "Bar Chart": ["Feed Efficiency by Location"],
      "Line Chart": ["Average Feed Intake per Pig"],
      List: ["Underfed Pigs"],
    }),
    []
  );

  // For accessibility: whenever the widget form opens, focus on the first input
  useEffect(() => {
    if (showWidgetForm && widgetFormToggleRef.current) {
      widgetFormToggleRef.current.focus();
    }
  }, [showWidgetForm]);

  // --- Handle Excel Upload ---
  const handleExcelUpload = useCallback((e) => {
    setExcelFile(e.target.files[0]);
  }, []);

  // Create a new dashboard based on uploaded Excel data
  const createDashboard = useCallback(async () => {
    if (!newDashboardName.trim() || !excelFile) {
      // Using a live region or role="alert" in template to announce this
      alert("Please enter a dashboard name and select an Excel file!");
      return;
    }

    try {
      const { animalData, visitData } = await parseExcelFile(excelFile);

      if (!animalData.length || !visitData.length) {
        alert(
          "Excel file must contain non‐empty 'Animal data' and 'Visit data' sheets!"
        );
        return;
      }

      addDashboard({
        name: newDashboardName.trim(),
        widgets: [],
        data: { animalData, visitData },
      });

      setNewDashboardName("");
      setExcelFile(null);
    } catch (error) {
      console.error("Error parsing Excel:", error);
      alert("Failed to read Excel file. Please check file format.");
    }
  }, [newDashboardName, excelFile, addDashboard]);

  // --- User Creation Handlers ---
  const handleUserInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCreateUser = useCallback(() => {
    if (!newUser.username.trim() || !newUser.password) {
      alert("Please enter a valid username and password.");
      return;
    }
    createUser(newUser);
    setNewUser({ username: "", password: "", role: "user" });
  }, [newUser, createUser]);

  // --- Widget Form Handlers ---
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setWidgetForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAddWidget = useCallback(() => {
    const dashboard = dashboards[selectedDashboard];
    if (!dashboard) return;

    const animalData = dashboard.data?.animalData || [];
    const visitData = dashboard.data?.visitData || [];
    const validAnimals = filterValidAnimals(animalData);

    let widgetToAdd = { ...widgetForm };

    switch (widgetForm.type) {
      case "Number Card":
        if (widgetForm.metric === "Number of pigs") {
          widgetToAdd.value = calculateNumberOfPigs(validAnimals);
        }
        break;

      case "List":
        if (widgetForm.metric === "Underfed Pigs") {
          widgetToAdd.data = getUnderfedPigs(validAnimals, visitData);
        }
        break;

      case "Bar Chart":
        if (widgetForm.metric === "Feed Efficiency by Location") {
          widgetToAdd.data = getFeedEfficiencyByLocation(
            validAnimals,
            visitData
          );
        }
        break;

      case "Line Chart":
        if (widgetForm.metric === "Average Feed Intake per Pig") {
          widgetToAdd.data = getAverageFeedIntakePerDay(
            validAnimals,
            visitData
          );
        }
        break;

      default:
        break;
    }

    addWidgetToDashboard(selectedDashboard, widgetToAdd);
    setShowWidgetForm(false);
  }, [
    dashboards,
    selectedDashboard,
    widgetForm,
    addWidgetToDashboard,
  ]);

  // Remove a widget from the selected dashboard
  const removeWidgetHandler = useCallback(
    (widgetIndex) => {
      removeWidgetFromDashboard(selectedDashboard, widgetIndex);
    },
    [selectedDashboard, removeWidgetFromDashboard]
  );

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
      metricOptions={metricOptions}
      handleFormChange={handleFormChange}
      handleAddWidget={handleAddWidget}
      showWidgetForm={showWidgetForm}
      toggleWidgetForm={() =>
        setShowWidgetForm((prev) => !prev)
      }
      widgetFormToggleRef={widgetFormToggleRef}
      // Remove widget handler
      removeWidget={removeWidgetHandler}
      // Other props
      logout={logout}
    />
  );
}
