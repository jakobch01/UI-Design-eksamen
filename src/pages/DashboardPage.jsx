// src/pages/DashboardPage.jsx

import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import SidebarUser from "../organisms/SidebarUser";
import DashboardWidgets from "../organisms/DashboardWidgets";
import Text from "../atoms/Text";
import Button from "../atoms/Button";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { dashboards } = useDashboard();
  const [selectedDashboard, setSelectedDashboard] = useState(0);

  // If there are no dashboards at all, show a full-screen message
  if (!dashboards || dashboards.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center">
        <Text as="h2" size="xl" color="white">
          No dashboards available.
        </Text>
      </div>
    );
  }

  const currentDashName = dashboards[selectedDashboard]?.name || "Dashboard";

  return (
    <div className="w-full min-h-screen bg-gray-800 text-white flex flex-col md:flex-row">
      {/** =========================================================================
          Sidebar: always visible, full-width on mobile (stacked on top), 64px on md+
          ========================================================================= */}
      <aside className="w-full md:w-64 bg-gray-700 text-white">
        <div className="p-4 border-b border-gray-600 md:hidden">
          {/** On mobile, show the dashboard name at top of sidebar **/}
          <Text as="h2" size="lg" color="white">
            {currentDashName}
          </Text>
        </div>

        <SidebarUser
          dashboards={dashboards}
          selectedDashboard={selectedDashboard}
          setSelectedDashboard={(idx) => setSelectedDashboard(idx)}
        />
      </aside>

      {/** =========================================================================
          Main content: stacks under sidebar on mobile, sits to the right on md+
          ========================================================================= */}
      <main className="flex-1 bg-gray-700 p-4 sm:p-6 overflow-y-auto w-full">
        {/** Header: always show title and logout button (adjust spacing on mobile) **/}
        <div className="flex justify-between items-center mb-4">
          <Text as="h2" size="xl" color="white">
            {currentDashName}
          </Text>
          <Button onClick={logout} variant="danger">
            Logout
          </Button>
        </div>

        {/** If the selected dashboard has no widgets **/}
        {dashboards[selectedDashboard]?.widgets?.length === 0 ? (
          <Text size="base" color="gray-300">
            No widgets have been added to this dashboard.
          </Text>
        ) : (
          <DashboardWidgets
            widgets={dashboards[selectedDashboard].widgets}
            removeWidget={() => {}}
          />
        )}
      </main>
    </div>
  );
}
