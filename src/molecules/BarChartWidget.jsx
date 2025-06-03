import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Text from "../atoms/Text";

export default function BarChartWidget({ title, data }) {
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
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="location"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 12 }} formatter={(value) => value.toFixed(2)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="efficiency" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
