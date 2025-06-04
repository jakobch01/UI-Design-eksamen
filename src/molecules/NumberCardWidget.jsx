import React from "react";
import Text from "../atoms/Text";

export default function NumberCardWidget({ title, value }) {
  return (
    <div className="w-full border-4 border-blue-500 bg-white text-black rounded p-2 sm:p-4 md:p-6 text-center">
      <Text
        size="large"
        className="font-semibold text-lg sm:text-xl md:text-2xl mb-1"
      >
        {title}
      </Text>
      <Text
        size="xl"
        className="font-bold text-2xl sm:text-3xl md:text-4xl"
      >
        {value}
      </Text>
    </div>
  );
}
