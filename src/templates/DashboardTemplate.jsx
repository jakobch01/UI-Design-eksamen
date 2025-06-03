import React from "react";
import Text from "../atoms/Text";

export default function DashboardTemplate({ title, subtitle, logout, children }) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Text as="h1" size="xl" color="white" className="mb-2">
        {title}
      </Text>
      {subtitle && (
        <Text size="small" color="gray-300" className="mb-4">
          {subtitle}
        </Text>
      )}
      {children}
    </div>
  );
}
