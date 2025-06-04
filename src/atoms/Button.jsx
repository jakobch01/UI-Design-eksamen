import React from 'react';

export default function Button({ children, onClick, variant = "primary", className = "" }) {
  const baseClasses = "px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300 focus:ring-offset-blue-900",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300 focus:ring-offset-gray-900",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 focus:ring-offset-red-900",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
