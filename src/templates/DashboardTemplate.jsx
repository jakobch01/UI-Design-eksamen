// src/organisms/DashboardTemplate.jsx
import React from "react";
import Text from "../atoms/Text";

export default function DashboardTemplate({ title, subtitle, children }) {
  return (
    <div className="w-full bg-gray-800 text-white">
      {/* Wrapper to center & constrain width on very large screens */}
      <div className="max-w-screen-xl mx-auto w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4">
        {/* Title */}
        <Text
          as="h1"
          color="white"
          className="
            mb-2 
            text-2xl            /* mobile */
            sm:text-3xl         /* ≥640px */
            md:text-4xl         /* ≥768px */
            lg:text-5xl         /* ≥1024px */
            xl:text-6xl         /* ≥1280px */
            font-semibold 
            leading-tight       /* lidt strammere line-height for store overskrifter */
          "
        >
          {title}
        </Text>

        {/* Subtitle (hvis til stede) */}
        {subtitle && (
          <Text
            color="gray-300"
            className="
              mb-4
              text-xs             /* mobile */
              sm:text-sm          /* ≥640px */
              md:text-base        /* ≥768px */
              lg:text-lg          /* ≥1024px */
              xl:text-xl          /* ≥1280px */
              leading-snug
            "
          >
            {subtitle}
          </Text>
        )}

        {/* Selve indholdet */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
