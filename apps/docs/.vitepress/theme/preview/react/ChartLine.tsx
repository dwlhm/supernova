import * as React from "react";

export interface ChartPoint {
  label: string;
  value: number;
}
export interface ChartLineProps {
  data?: ChartPoint[];
  area?: boolean;
  showGridLines?: boolean;
  showDataLabels?: boolean;
  showAxisLabels?: boolean;
  strokeClass?: string;
  fillClass?: string;
  ariaLabel?: string;
  className?: string;
}

import { cn } from "./utils";

function ChartLine(props: ChartLineProps) {
  props = {
    data: [],
    area: false,
    showGridLines: true,
    showDataLabels: false,
    showAxisLabels: true,
    strokeClass: "stroke-chart-series-1",
    fillClass: "fill-chart-series-1",
    ariaLabel: "Line chart",
    className: "",
    ...props,
  };
  function normalized() {
    const rows: ChartPoint[] = props.data || [];
    let max = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].value > max) {
        max = rows[i].value;
      }
    }
    if (max <= 0) {
      max = 1;
    }
    const total = rows.length;
    const points: Array<{
      key: string;
      label: string;
      x: number;
      y: number;
      value: number;
    }> = [];
    for (let i = 0; i < total; i++) {
      const x = total > 1 ? (i / (total - 1)) * 100 : 50;
      const y = 100 - (rows[i].value / max) * 100;
      points.push({
        key: "pt-" + i,
        label: rows[i].label,
        x: x,
        y: y,
        value: rows[i].value,
      });
    }
    return points;
  }

  function linePoints() {
    const points = normalized();
    let output = "";
    for (let i = 0; i < points.length; i++) {
      output = output + points[i].x + "," + points[i].y + " ";
    }
    return output.trim();
  }

  function areaPoints() {
    const points = normalized();
    if (points.length === 0) {
      return "";
    }
    return "0,100 " + linePoints() + " 100,100";
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", props.className)}>
      <div
        className="relative h-44 w-full"
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
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {props.area ? (
            <polygon
              className={cn(props.fillClass, "opacity-20")}
              points={areaPoints()}
            />
          ) : null}
          <polyline
            fill="none"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={props.strokeClass}
            points={linePoints()}
          />
        </svg>
      </div>
      {props.showAxisLabels ? (
        <div className="flex w-full items-start gap-2">
          {normalized()?.map((point) => (
            <span
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
              key={point.key}
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

export default ChartLine;
