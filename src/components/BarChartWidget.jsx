import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

export default function BarChartWidget({ title, data }) {
  return (
    <div className="bg-white p-4 rounded shadow text-black">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
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
