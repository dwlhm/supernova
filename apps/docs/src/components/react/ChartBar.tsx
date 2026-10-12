import * as React from "react";

export interface ChartPoint {
  label: string;
  value: number;
}
export interface ChartBarProps {
  data?: ChartPoint[];
  colorClass?: string;
  showGridLines?: boolean;
  showDataLabels?: boolean;
  showAxisLabels?: boolean;
  ariaLabel?: string;
  className?: string;
}

import { cn } from "./utils";

function ChartBar(props: ChartBarProps) {
  props = {
    data: [],
    colorClass: "bg-chart-series-1",
    showGridLines: true,
    showDataLabels: true,
    showAxisLabels: true,
    ariaLabel: "Bar chart",
    className: "",
    ...props,
  };
  function barHeight(value: number) {
    const rows: ChartPoint[] = props.data || [];
    let max = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].value > max) {
        max = rows[i].value;
      }
    }
    if (max <= 0) {
      return "0%";
    }
    const pct = (value / max) * 100;
    if (pct < 0) {
      return "0%";
    }
    return pct + "%";
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", props.className)}>
      <div
        className="relative flex h-44 w-full items-end gap-2"
        role="img"
        aria-label={props.ariaLabel}
      >
        {props.showGridLines ? (
          <div
            className="pointer-events-none absolute inset-0 flex flex-col justify-between"
            aria-hidden="true"
          >
            <div className="border-t border-components-chart-all-color-grid-line-stroke-default" />
            <div className="border-t border-components-chart-all-color-grid-line-stroke-default" />
            <div className="border-t border-components-chart-all-color-grid-line-stroke-default" />
            <div className="border-t border-components-chart-all-color-grid-line-stroke-default" />
            <div className="border-t border-components-chart-all-color-grid-line-stroke-default" />
          </div>
        ) : null}
        {props.data?.map((point) => (
          <div
            className="relative flex h-full flex-1 items-end"
            key={point.label}
          >
            <div
              className={cn("w-full rounded-rounded-sm", props.colorClass)}
              style={{
                height: barHeight(point.value),
              }}
            />
          </div>
        ))}
      </div>
      {props.showAxisLabels ? (
        <div className="flex w-full items-start gap-2">
          {props.data?.map((point) => (
            <span
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
              key={point.label}
            >
              {props.showDataLabels ? (
                <span className="text-xs font-medium text-components-chart-all-color-data-label-text-default">
                  {point.value}
                </span>
              ) : null}
              <span className="w-full truncate text-xs text-components-chart-all-color-axis-label-text-default">
                {point.label}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ChartBar;
