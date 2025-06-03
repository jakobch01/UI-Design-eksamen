// src/atoms/Select.jsx
import React from "react";

export default function Select({ name, value, onChange, children, className = "" }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {children}
    </select>
  );
}
