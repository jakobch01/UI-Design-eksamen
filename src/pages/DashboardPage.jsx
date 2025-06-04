import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import SidebarUser from "../organisms/SidebarUser";
import DashboardWidgets from "../organisms/DashboardWidgets";
import Text from "../atoms/Text";
import Button from "../atoms/Button";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { dashboards, removeWidgetFromDashboard } = useDashboard();
  const [selectedDashboard, setSelectedDashboard] = useState(0);

  // Refs for focus management
  const noDashRef = useRef(null);
  const noWidgetRef = useRef(null);

  // If there are no dashboards at all, announce and focus the message.
  useEffect(() => {
    if ((!dashboards || dashboards.length === 0) && noDashRef.current) {
      noDashRef.current.focus();
    }
  }, [dashboards]);

  // If the selected dashboard exists but has no widgets,
  // announce and focus the “no widgets” message.
  useEffect(() => {
    if (
      dashboards &&
      dashboards[selectedDashboard] &&
      dashboards[selectedDashboard].widgets.length === 0 &&
      noWidgetRef.current
    ) {
      noWidgetRef.current.focus();
    }
  }, [dashboards, selectedDashboard]);

  // Memoized handler to change dashboards
  const handleSelectDashboard = useCallback(
    (idx) => {
      setSelectedDashboard(idx);
    },
    [setSelectedDashboard]
  );

  // Memoized handler to remove a widget
  const handleRemoveWidget = useCallback(
    (widgetIndex) => {
      removeWidgetFromDashboard(selectedDashboard, widgetIndex);
    },
    [removeWidgetFromDashboard, selectedDashboard]
  );

  // If there are truly no dashboards, render a full‐screen message
  if (!dashboards || dashboards.length === 0) {
    return (
      <div
        className="w-full min-h-screen bg-gray-800 flex items-center justify-center p-4"
        aria-live="assertive"
      >
        <Text
          as="h1"
          size="xl"
          color="white"
          className="text-center"
          tabIndex={-1}
          ref={noDashRef}
        >
          Ingen dashboards tilgængelige.
        </Text>
      </div>
    );
  }

  // Otherwise, at least one dashboard exists
  const currentDash = dashboards[selectedDashboard];
  const currentDashName = currentDash?.name || "Dashboard";

  return (
    <div className="w-full min-h-screen bg-gray-800 text-white flex flex-col md:flex-row">
      {/** =========================================================================
          Sidebar: always visible, full-width on mobile, 64px on md+
          ========================================================================= */}
      <aside
        className="w-full md:w-64 bg-gray-700 text-white"
        aria-label="Dashboard navigation"
      >
        <div className="p-4 border-b border-gray-600 md:hidden">
          {/** On mobile, show the current dashboard name at top of sidebar **/}
          <Text as="h2" size="lg" color="white">
            {currentDashName}
          </Text>
        </div>

        <SidebarUser
          dashboards={dashboards}
          selectedDashboard={selectedDashboard}
          setSelectedDashboard={handleSelectDashboard}
        />
      </aside>

      {/** =========================================================================
          Main content: stacks under sidebar on mobile, sits to the right on md+
          ========================================================================= */}
      <main className="flex-1 bg-gray-700 p-4 sm:p-6 overflow-y-auto w-full">
        {/** Header: page title and logout **/}
        <header className="flex justify-between items-center mb-4">
          <Text as="h1" size="xl" color="white">
            {currentDashName}
          </Text>
          <Button
            type="button"
            variant="danger"
            onClick={logout}
            aria-label="Log ud"
          >
            Log ud
          </Button>
        </header>

        {/** Widget area **/}
        {currentDash.widgets.length === 0 ? (
          <Text
            as="p"
            size="base"
            color="gray-300"
            className="mt-6"
            aria-live="polite"
            tabIndex={-1}
            ref={noWidgetRef}
          >
            Der er ingen widgets tilføjet til dette dashboard.
          </Text>
        ) : (
          <DashboardWidgets
            widgets={currentDash.widgets}
            removeWidget={handleRemoveWidget}
          />
        )}
      </main>
    </div>
  );
}
