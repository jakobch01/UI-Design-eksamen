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
      <div className="bg-white p-4 sm:p-6 rounded shadow text-black">
        <Text
          as="h3"
          size="xl"
          color="black"
          className="mb-2 text-lg sm:text-xl"
        >
          {title}
        </Text>
        <Text size="small" color="gray-600" className="text-sm sm:text-base">
          No data available
        </Text>
      </div>
    );
  }

  // Prepare single line data
  const lineData = data.map((item) => ({
    date: item.date,
    value: parseFloat(item.value?.toFixed(2)) || 0,
  }));

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow text-black">
      <Text
        as="h3"
        size="xl"
        color="black"
        className="mb-2 text-lg sm:text-xl"
      >
        {title}
      </Text>
      <div className="w-full h-48 sm:h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={50}
              tick={{ fontSize: 10 }}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value) => value.toFixed(2)}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ fontSize: 12 }}
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
    </div>
  );
}
