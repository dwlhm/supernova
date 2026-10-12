import * as React from "react";

export interface ChartLegendItem {
  label: string;
  colorClass: string;
}
export interface ChartLegendProps {
  items?: ChartLegendItem[];
  className?: string;
}

import { cn } from "./utils";

function ChartLegend(props: ChartLegendProps) {
  props = { items: [], className: "", ...props };
  function dotClasses() {
    return "h-2 w-2 shrink-0 rounded-rounded-full";
  }

  return (
    <ul className={cn("flex flex-wrap items-center gap-4", props.className)}>
      {props.items?.map((item) => (
        <li className="flex items-center gap-2" key={item.label}>
          <span
            aria-hidden="true"
            className={cn(dotClasses(), item.colorClass)}
          />
          <span className="text-xs text-components-chart-all-color-legend-label-text-default">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default ChartLegend;
