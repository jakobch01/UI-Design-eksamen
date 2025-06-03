// src/organisms/DashboardTemplate.jsx

import React, { memo } from "react";
import PropTypes from "prop-types";
import Text from "../atoms/Text";

/**
 * A page‐level wrapper that provides a consistent header and main content area.
 * - Uses semantic <header> and <main> landmarks.
 * - Associates the title with aria‐labeling for screen readers.
 * - Ensures sufficient color contrast via Tailwind classes (white text on gray‐800).
 * - Memoized to avoid unnecessary re‐renders when props don’t change.
 */
function DashboardTemplate({ title, subtitle, children }) {
  return (
    <div className="w-full bg-gray-800 text-white">
      <div className="max-w-screen-xl mx-auto w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4">
        {/* Header Landmark */}
        <header aria-labelledby="page-title">
          <Text
            id="page-title"
            as="h1"
            color="white"
            className="
              mb-2
              text-2xl       /* mobile */
              sm:text-3xl    /* ≥640px */
              md:text-4xl    /* ≥768px */
              lg:text-5xl    /* ≥1024px */
              xl:text-6xl    /* ≥1280px */
              font-semibold
              leading-tight  /* tighter line-height for large text */
            "
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              id="page-subtitle"
              as="p"
              color="gray-300"
              className="
                mb-4
                text-xs         /* mobile */
                sm:text-sm      /* ≥640px */
                md:text-base    /* ≥768px */
                lg:text-lg      /* ≥1024px */
                xl:text-xl      /* ≥1280px */
                leading-snug
              "
            >
              {subtitle}
            </Text>
          )}
        </header>

        {/* Main Landmark */}
        <main aria-labelledby="page-title">{children}</main>
      </div>
    </div>
  );
}

DashboardTemplate.propTypes = {
  /** Main title of the page (rendered as <h1>) */
  title: PropTypes.string.isRequired,
  /** Optional subtitle text (rendered as <p>) */
  subtitle: PropTypes.string,
  /** Page‐specific content */
  children: PropTypes.node.isRequired,
};

DashboardTemplate.defaultProps = {
  subtitle: "",
};

// Memoize to prevent re‐render unless title, subtitle, or children change
export default memo(DashboardTemplate);
