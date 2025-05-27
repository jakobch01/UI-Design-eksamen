import React from "react";

export default function NumberCardWidget({ title, value }) {
  return (
    <div className="border-4 border-blue-500 p-4 rounded text-center bg-white text-black">
      <p className="font-semibold text-lg">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
