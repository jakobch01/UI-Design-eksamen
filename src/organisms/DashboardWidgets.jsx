import WidgetCard from "../molecules/WidgetCard";
import NumberCardWidget from "../molecules/NumberCardWidget";
import BarChartWidget from "../molecules/BarChartWidget";
import LineChartWidget from "../molecules/LineChartWidget";
import UnderfedPigsWidget from "../molecules/UnderfedPigsWidget";

export default function DashboardWidgets({ widgets, removeWidget }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {widgets?.map((widget, idx) => (
        <WidgetCard
          key={idx}
          title={`${widget.type}: ${widget.metric}`}
          onRemove={() => removeWidget(idx)}
        >
          {widget.type === "Number Card" ? (
            <NumberCardWidget title={widget.metric} value={widget.value} />
          ) : widget.type === "Bar Chart" ? (
            <BarChartWidget title={widget.metric} data={widget.data} />
          ) : widget.type === "Line Chart" ? (
            <LineChartWidget title={widget.metric} data={widget.data} groupKey="date" />
          ) :  widget.metric === "Underfed Pigs"  ? (
            <UnderfedPigsWidget data={widget.data} />
          ) : (
            <p className="text-sm">Unknown Widget</p>
          )}
        </WidgetCard>
      ))}
    </div>
  );
}
