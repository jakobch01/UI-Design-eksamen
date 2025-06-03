// src/templates/SuperUserPanelTemplate.jsx

import React from "react";
import Sidebar from "../organisms/Sidebar";
import DashboardWidgets from "../organisms/DashboardWidgets";
import WidgetForm from "../molecules/WidgetForm";
import Text from "../atoms/Text";
import Button from "../atoms/Button";

export default function SuperUserPanelTemplate({
  dashboards,
  selectedDashboard,
  setSelectedDashboard,

  // Sidebar props:
  newDashboardName,
  setNewDashboardName,
  handleExcelUpload,
  createDashboard,
  newUser,
  handleUserInputChange,
  handleCreateUser,

  // Widget addition props:
  widgetForm,
  handleFormChange,
  handleAddWidget,
  logout,
  removeWidget,
  showWidgetForm,
  toggleWidgetForm,
}) {
  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex gap-6">
      {/* Sidebar now holds both the "Opret dashboard" & "Opret bruger" forms */}
      <Sidebar
        dashboards={dashboards}
        selectedDashboard={selectedDashboard}
        setSelectedDashboard={setSelectedDashboard}

        newDashboardName={newDashboardName}
        setNewDashboardName={setNewDashboardName}
        handleExcelUpload={handleExcelUpload}
        createDashboard={createDashboard}

        newUser={newUser}
        handleUserInputChange={handleUserInputChange}
        handleCreateUser={handleCreateUser}
      />

      <main className="flex-1 bg-gray-700 rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <Text as="h2" size="xl" color="white">
            {dashboards[selectedDashboard]?.name || "Dashboard"}
          </Text>
          <div className="flex gap-2">
            <Button onClick={logout} variant="danger">
              Logout
            </Button>
            <Button onClick={toggleWidgetForm} variant="primary">
              {showWidgetForm ? "Cancel" : "Add Widget"}
            </Button>
          </div>
        </div>

        {showWidgetForm && (
          <div className="bg-gray-600 p-4 rounded mb-6">
            <Text as="h3" size="large" color="white" className="mb-2">
              Add Widget
            </Text>
            <WidgetForm widgetForm={widgetForm} handleFormChange={handleFormChange} />
            <Button onClick={handleAddWidget} variant="primary" className="mt-4">
              Save Widget
            </Button>
          </div>
        )}

        <DashboardWidgets
          widgets={dashboards[selectedDashboard]?.widgets}
          removeWidget={removeWidget}
        />
      </main>
    </div>
  );
}
