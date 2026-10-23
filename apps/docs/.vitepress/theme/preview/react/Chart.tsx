import * as React from "react";

export interface ChartLegendEntry {
  label: string;
  colorClass: string;
}
export interface ChartProps {
  title?: string;
  description?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  legend?: ChartLegendEntry[];
  showLegend?: boolean;
  className?: string;
  children?: any;
}

import { cn } from "./utils";
import ChartLegend from "./ChartLegend";

function Chart(props: ChartProps) {
  props = {
    title: "Revenue Overview",
    description: "Weekly revenue breakdown by day",
    showTitle: true,
    showDescription: true,
    legend: [],
    showLegend: true,
    className: "",
    ...props,
  };
  function hasHeading() {
    return props.showTitle || props.showDescription;
  }

  return (
    <figure
      className={cn(
        "flex w-full flex-col gap-4 rounded-rounded-lg border border-components-chart-all-color-container-border-default bg-components-chart-all-color-container-background-default p-5",
        props.className
      )}
    >
      {hasHeading() ? (
        <figcaption className="flex flex-col gap-1">
          {props.showTitle ? (
            <span className="text-sm font-semibold text-components-chart-all-color-title-text-default">
              {props.title}
            </span>
          ) : null}
          {props.showDescription ? (
            <span className="text-xs text-components-chart-all-color-description-text-default">
              {props.description}
            </span>
          ) : null}
        </figcaption>
      ) : null}
      {props.showLegend ? <ChartLegend items={props.legend} /> : null}
      <div className="w-full">{props.children}</div>
    </figure>
  );
}

export default Chart;
