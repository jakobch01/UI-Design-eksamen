// src/templates/SuperUserPanelTemplate.jsx

import React, { memo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Sidebar from "../organisms/Sidebar";
import DashboardWidgets from "../organisms/DashboardWidgets";
import WidgetForm from "../molecules/WidgetForm";
import Text from "../atoms/Text";
import Button from "../atoms/Button";

function SuperUserPanelTemplate({
  dashboards,
  selectedDashboard,
  setSelectedDashboard,

  // Sidebar props
  newDashboardName,
  setNewDashboardName,
  handleExcelUpload,
  createDashboard,
  newUser,
  handleUserInputChange,
  handleCreateUser,

  // Widget addition props
  widgetForm,
  handleFormChange,
  handleAddWidget,
  logout,
  removeWidget,
  showWidgetForm,
  toggleWidgetForm,
}) {
  // Refs for focus management
  const widgetSectionRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // When the widget form appears, move focus to its heading
  useEffect(() => {
    if (showWidgetForm && widgetSectionRef.current) {
      widgetSectionRef.current.focus();
    } else if (!showWidgetForm && toggleButtonRef.current) {
      toggleButtonRef.current.focus();
    }
  }, [showWidgetForm]);

  const currentDashName =
    dashboards[selectedDashboard]?.name || "Dashboard";

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex gap-6">
      {/* =========================================================================
          Sidebar: navigation and creation forms
          ========================================================================= */}
      <aside
        className="w-64 bg-gray-700 text-white rounded"
        aria-label="Sidebar with dashboard and user creation"
      >
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
      </aside>

      {/* =========================================================================
          Main content: title, logout, widget form toggle, widget list
          ========================================================================= */}
      <main
        className="flex-1 bg-gray-700 rounded p-6"
        role="main"
        aria-labelledby="panel-title"
      >
        <header className="flex justify-between items-center mb-4">
          <Text
            id="panel-title"
            as="h1"
            size="xl"
            color="white"
            className="leading-tight"
          >
            {currentDashName}
          </Text>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={logout}
              variant="danger"
              aria-label="Logud"
            >
              Log ud
            </Button>

            <Button
              type="button"
              onClick={toggleWidgetForm}
              variant="primary"
              aria-expanded={showWidgetForm}
              aria-controls="widget-form-section"
              ref={toggleButtonRef}
            >
              {showWidgetForm ? "Annuller" : "Tilføj widget"}
            </Button>
          </div>
        </header>

        {showWidgetForm && (
          <section
            id="widget-form-section"
            className="bg-gray-600 p-4 rounded mb-6"
            aria-labelledby="widget-form-title"
            tabIndex={-1}
            ref={widgetSectionRef}
          >
            <Text
              id="widget-form-title"
              as="h2"
              size="large"
              color="white"
              className="mb-2"
            >
              Tilføj widget
            </Text>

            <WidgetForm
              widgetForm={widgetForm}
              handleFormChange={handleFormChange}
            />

            <Button
              type="button"
              onClick={handleAddWidget}
              variant="primary"
              className="mt-4"
            >
              Gem widget
            </Button>
          </section>
        )}

        <section aria-labelledby="widgets-list-title">
          <Text
            id="widgets-list-title"
            as="h2"
            size="lg"
            color="white"
            className="sr-only"
          >
            Liste over widgets
          </Text>

          <DashboardWidgets
            widgets={dashboards[selectedDashboard]?.widgets}
            removeWidget={removeWidget}
          />
        </section>
      </main>
    </div>
  );
}

SuperUserPanelTemplate.propTypes = {
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      widgets: PropTypes.array,
    })
  ).isRequired,
  selectedDashboard: PropTypes.number.isRequired,
  setSelectedDashboard: PropTypes.func.isRequired,

  newDashboardName: PropTypes.string.isRequired,
  setNewDashboardName: PropTypes.func.isRequired,
  handleExcelUpload: PropTypes.func.isRequired,
  createDashboard: PropTypes.func.isRequired,

  newUser: PropTypes.shape({
    username: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  handleUserInputChange: PropTypes.func.isRequired,
  handleCreateUser: PropTypes.func.isRequired,

  widgetForm: PropTypes.shape({
    type: PropTypes.string,
    metric: PropTypes.string,
  }).isRequired,
  handleFormChange: PropTypes.func.isRequired,
  handleAddWidget: PropTypes.func.isRequired,

  logout: PropTypes.func.isRequired,
  removeWidget: PropTypes.func.isRequired,

  showWidgetForm: PropTypes.bool.isRequired,
  toggleWidgetForm: PropTypes.func.isRequired,
};

// Memoize to prevent re‐render unless props change
export default memo(SuperUserPanelTemplate);
