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
import Text from "../atoms/Text";

export default function LineChartWidget({ title, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow text-black">
        <Text as="h3" size="xl" color="black" className="mb-2">{title}</Text>
        <Text size="small" color="gray-600">No data available</Text>
      </div>
    );
  }

  // Prepare single line data
  const lineData = data.map((item) => ({
    date: item.date,
    value: parseFloat(item.value?.toFixed(2)) || 0,
  }));

  return (
    <div className="bg-white p-4 rounded shadow text-black">
      <Text as="h3" size="xl" color="black" className="mb-2">{title}</Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            dataKey="value"
            type="monotone"
            stroke="#007bff"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
