// src/organisms/SidebarUser.jsx
import React from "react";
import Text from "../atoms/Text";

export default function SidebarUser({
  dashboards,
  selectedDashboard,
  setSelectedDashboard,
}) {
  return (
    <aside className="w-64 bg-gray-700 rounded p-4 text-white flex flex-col gap-6">
      {/* Titel */}
      <Text as="h3" size="large" color="white" className="uppercase mb-2">
        Dashboards
      </Text>

      {/* Liste af allerede oprettede dashboards */}
      <ul className="space-y-2">
        {dashboards.map((d, idx) => (
          <li
            key={idx}
            onClick={() => setSelectedDashboard(idx)}
            className={`p-2 rounded cursor-pointer ${
              idx === selectedDashboard
                ? "bg-blue-600 font-semibold"
                : "hover:bg-gray-600"
            }`}
          >
            {d.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
