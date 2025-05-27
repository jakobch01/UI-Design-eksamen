import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function LineChartWidget({ title, data, groupKey = "group" }) {
  const grouped = {};

  data.forEach((d) => {
    const group = String(d[groupKey] || "Unknown");
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push({
      date: d.date,
      value: parseFloat(d.value.toFixed(2)),
    });
  });

  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFD9", "#FF8C33", "#8CFF33", "#338CFF", "#FF3333",
  ];

  return (
    <div className="bg-white p-4 rounded shadow text-black">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {Object.entries(grouped).slice(0, 5).map(([group, values], idx) => (
            <Line
              key={group}
              dataKey="value"
              data={values}
              name={`Location: ${group}`}
              type="monotone"
              stroke={colors[idx % colors.length]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-2">
        Showing top 5 locations for clarity.
      </p>
    </div>
  );
}
