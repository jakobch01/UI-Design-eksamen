import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function LineChartWidget({ title, data, groupKey = "date" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow text-black">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">No data available</p>
      </div>
    );
  }

  const hasGroup = data.some((d) => d.group !== undefined);
  const groupedData = {};

  if (hasGroup) {
    data.forEach((item) => {
      const group = item.group || "Unknown";
      if (!groupedData[group]) groupedData[group] = [];
      groupedData[group].push({
        date: item.date,
        value: parseFloat(item.value?.toFixed(2)) || 0,
      });
    });
  }

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
          {hasGroup && <Legend wrapperStyle={{ fontSize: "12px" }} />}

          {hasGroup
            ? Object.entries(groupedData).map(([group, groupData], idx) => (
                <Line
                  key={group}
                  dataKey="value"
                  data={groupData}
                  name={group}
                  type="monotone"
                  stroke={colors[idx % colors.length]}
                  dot={false}
                />
              ))
            : (
                <Line
                  dataKey="value"
                  data={data}
                  type="monotone"
                  stroke="#007bff"
                  dot={false}
                />
              )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
