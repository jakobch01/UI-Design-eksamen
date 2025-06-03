import React from 'react';

export default function Heading({ level = 1, children, className = "" }) {
  const Tag = `h${level}`;
  const baseClasses = "font-bold text-gray-900";

  const sizes = {
    1: "text-3xl",
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
    5: "text-base",
    6: "text-sm",
  };

  return (
    <Tag className={`${baseClasses} ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
}
