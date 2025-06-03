import React from "react";
import Text from "../atoms/Text";

export default function SidebarUser({
  dashboards,
  selectedDashboard,
  setSelectedDashboard,
}) {
  return (
    <aside className="w-full md:w-64 bg-gray-700 rounded p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      {/* Titel */}
      <Text
        as="h3"
        size="large"
        color="white"
        className="uppercase mb-2 text-base sm:text-lg"
      >
        Dashboards
      </Text>

      {/* Liste af allerede oprettede dashboards */}
      <ul className="space-y-2">
        {dashboards.map((d, idx) => (
          <li
            key={idx}
            onClick={() => setSelectedDashboard(idx)}
            className={`
              p-2 rounded cursor-pointer 
              ${idx === selectedDashboard
                ? "bg-blue-600 font-semibold"
                : "hover:bg-gray-600"}
            `}
          >
            <Text size="base" color="white" className="truncate">
              {d.name}
            </Text>
          </li>
        ))}
      </ul>
    </aside>
  );
}
