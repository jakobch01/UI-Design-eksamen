import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function LineChartWidget({ title, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow text-black">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p>No data available for this selection.</p>
      </div>
    );
  }

  const color = "#3B82F6"; // Tailwind blue-500

  return (
    <div className="bg-white p-4 rounded shadow text-black">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => `${value.toFixed(2)} kg`}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Average Weight"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-2">
        Showing average weight gain over time for the selected location.
      </p>
    </div>
  );
}
