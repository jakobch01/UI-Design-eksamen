import React from "react";

export default function Text({
  as = "p",
  size = "base",
  color = "gray-700",
  children,
  className = "",
}) {
  const Tag = as;
  const sizeClasses = {
    small: "text-sm",
    base: "text-base",
    large: "text-lg",
    xl: "text-xl",
  };

  return (
    <Tag className={`${sizeClasses[size]} text-${color} ${className}`}>
      {children}
    </Tag>
  );
}
