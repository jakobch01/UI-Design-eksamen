// src/organisms/DashboardWidgets.jsx

import React from "react";
import { useAuth } from "../auth/AuthContext";
import WidgetCard from "../molecules/WidgetCard";
import NumberCardWidget from "../molecules/NumberCardWidget";
import BarChartWidget from "../molecules/BarChartWidget";
import LineChartWidget from "../molecules/LineChartWidget";
import UnderfedPigsWidget from "../molecules/UnderfedPigsWidget";

export default function DashboardWidgets({ widgets = [], removeWidget }) {
  const { user } = useAuth();
  const isSuperuser = user?.role === "superuser";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full
      ">
      {widgets.map((widget, idx) => {
        let Inner;
        if (widget.type === "Number Card") {
          Inner = <NumberCardWidget title={widget.metric} value={widget.value} />;
        } else if (widget.type === "Bar Chart") {
          Inner = <BarChartWidget title={widget.metric} data={widget.data} />;
        } else if (widget.type === "Line Chart") {
          Inner = (
            <LineChartWidget
              title={widget.metric}
              data={widget.data}
              groupKey="date"
            />
          );
        } else if (widget.type === "List" && widget.metric === "Underfed Pigs") {
          Inner = <UnderfedPigsWidget data={widget.data} />;
        } else {
          Inner = (
            <div className="bg-gray-600 p-4 rounded text-sm text-black">
              <p className="font-semibold">
                {widget.type}: {widget.metric}
              </p>
            </div>
          );
        }

        const onRemoveProp = isSuperuser ? () => removeWidget(idx) : undefined;

        return (
          <WidgetCard
            key={idx}
            title={`${widget.type}: ${widget.metric}`}
            onRemove={onRemoveProp}
          >
            {Inner}
          </WidgetCard>
        );
      })}
    </div>
  );
}
