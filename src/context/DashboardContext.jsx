// src/context/DashboardContext.jsx
import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboards, setDashboards] = useState([
    { name: "Dashboard 1", widgets: [], data: { animalData: [], visitData: [] } },
  ]);

  const addDashboard = (newDashboard) => {
    setDashboards((prev) => [...prev, newDashboard]);
  };

  const addWidgetToDashboard = (dashboardIndex, widget) => {
    setDashboards((prev) =>
      prev.map((dashboard, idx) =>
        idx === dashboardIndex
          ? {
              ...dashboard,
              widgets: [...dashboard.widgets, widget],
            }
          : dashboard
      )
    );
  };

  const removeWidgetFromDashboard = (dashboardIndex, widgetIndex) => {
    setDashboards((prev) =>
      prev.map((dashboard, idx) =>
        idx === dashboardIndex
          ? {
              ...dashboard,
              widgets: dashboard.widgets.filter((_, i) => i !== widgetIndex),
            }
          : dashboard
      )
    );
  };

  return (
    <DashboardContext.Provider
      value={{ dashboards, addDashboard, addWidgetToDashboard, removeWidgetFromDashboard }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
