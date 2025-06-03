import React from "react";
import Text from "../atoms/Text";

export default function NumberCardWidget({ title, value }) {
  return (
    <div className="border-4 border-blue-500 p-4 rounded text-center bg-white text-black">
      <Text size="large" className="font-semibold">{title}</Text>
      <Text size="xl" className="font-bold">{value}</Text>
    </div>
  );
}
