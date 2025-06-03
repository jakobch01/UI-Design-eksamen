// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useDashboard } from "../context/DashboardContext";

// Atomer & organismer
import SidebarUser from "../organisms/SidebarUser";
import DashboardWidgets from "../organisms/DashboardWidgets";
import Text from "../atoms/Text";
import Button from "../atoms/Button";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dashboards } = useDashboard();

  // Lokalt state: hvilket dashboard er valgt
  const [selectedDashboard, setSelectedDashboard] = useState(0);

  // Hvis der ingen dashboards er, kan vi evt. redirecte eller vise tom besked:
  if (!dashboards || dashboards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <Text size="large" color="white">
          Ingen dashboards tilgængelige.
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex gap-6">
      {/* Sidebar med liste over eksisterende dashboards */}
      <SidebarUser
        dashboards={dashboards}
        selectedDashboard={selectedDashboard}
        setSelectedDashboard={setSelectedDashboard}
      />

      {/* Hovedområde */}
      <main className="flex-1 bg-gray-700 rounded p-6 flex flex-col">
        {/* Øverste linje: Dashboard-navn + Log ud-knap */}
        <div className="flex justify-between items-center mb-4">
          <Text as="h2" size="xl" color="white">
            {dashboards[selectedDashboard]?.name || "Dashboard"}
          </Text>
          <Button onClick={logout} variant="danger">
            Log ud
          </Button>
        </div>

        {/* Hvis der ikke er widgets, vis besked */}
        {dashboards[selectedDashboard]?.widgets?.length === 0 ? (
          <Text size="base" color="gray-300">
            Ingen widgets tilføjet til dette dashboard.
          </Text>
        ) : (
          <DashboardWidgets
            widgets={dashboards[selectedDashboard].widgets}
            // her giver vi removeWidget en “dummy”-funktion,
            // da almindelige brugere ikke kan fjerne widgets
            removeWidget={() => {}}
          />
        )}
      </main>
    </div>
  );
}
