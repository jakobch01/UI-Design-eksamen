import React from "react";
import Input from "../atoms/Input";
import Select from "../atoms/Select";

export default function WidgetForm({ widgetForm, handleFormChange }) {
  const metricOptions = {
    "Number Card": ["Number of pigs"],
    "Bar Chart": ["Feed Efficiency by Location"],
    "Line Chart": ["Average Feed Intake per Pig"],
    "List": ["Underfed Pigs"],
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
      <div>
        <label className="block text-white text-sm sm:text-base mb-1">
          Widget Type
        </label>
        <Select
          name="type"
          value={widgetForm.type}
          onChange={handleFormChange}
          className="w-full p-2 rounded"
        >
          <option value="Number Card">Number Card</option>
          <option value="Bar Chart">Bar Chart</option>
          <option value="Line Chart">Line Chart</option>
          <option value="List">List</option>
        </Select>
      </div>

      <div>
        <label className="block text-white text-sm sm:text-base mb-1">
          Metric
        </label>
        <Select
          name="metric"
          value={widgetForm.metric}
          onChange={handleFormChange}
          className="w-full p-2 rounded"
        >
          <option value="">Select metric</option>
          {metricOptions[widgetForm.type].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
