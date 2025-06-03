import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import Text from "../atoms/Text";

export default function BarChartWidget({ title, data }) {
  return (
    <div className="bg-white p-4 rounded shadow text-black">
      <Text as="h3" size="xl" color="black" className="mb-2">{title}</Text>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Legend />
          <Bar dataKey="efficiency" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
