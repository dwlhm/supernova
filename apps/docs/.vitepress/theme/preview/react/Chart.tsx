import * as React from "react";

export interface ChartLegendEntry {
  label: string;
  colorClass: string;
}
export interface ChartDataPoint {
  label: string;
  value?: number;
  values?: number[];
}
export interface ChartProps {
  type?: "bar" | "line" | "area" | "pie" | "donut";
  title?: string;
  description?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  showTooltip?: boolean;
  legend?: ChartLegendEntry[];
  data?: ChartDataPoint[];
  showLegend?: boolean;
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";
import ChartLegend from "./ChartLegend";
import ChartBar from "./ChartBar";
import ChartLine from "./ChartLine";
import ChartPie from "./ChartPie";

function Chart(props: ChartProps) {
  props = {
    type: "bar",
    title: "Revenue Overview",
    description: "Weekly revenue breakdown by day",
    showTitle: true,
    showDescription: true,
    showTooltip: true,
    legend: [],
    data: [],
    showLegend: true,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <figure
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex w-full flex-col gap-4 rounded-lg border border-border-default bg-background-default p-5 shadow-sm",
        props.className
      )}
    >
      {props.showTitle || props.showDescription ? (
        <figcaption className="flex flex-col gap-1">
          {props.showTitle ? (
            <span className="text-base leading-6 font-semibold text-foreground-default">
              {props.title}
            </span>
          ) : null}
          {props.showDescription ? (
            <span className="text-sm text-foreground-muted">
              {props.description}
            </span>
          ) : null}
        </figcaption>
      ) : null}
      {props.children ? <div className="w-full">{props.children}</div> : null}
      {!props.children ? (
        <div className="w-full">
          {props.type === "bar" ? (
            <ChartBar
              data={props.data}
              showTooltip={props.showTooltip}
              ariaLabel={props.title}
            />
          ) : null}
          {props.type === "line" || props.type === "area" ? (
            <ChartLine
              data={props.data}
              area={props.type === "area"}
              showTooltip={props.showTooltip}
              ariaLabel={props.title}
            />
          ) : null}
          {props.type === "pie" || props.type === "donut" ? (
            <ChartPie
              data={props.data}
              innerRadius={props.type === "donut" ? 30 : 0}
              showTooltip={props.showTooltip}
              ariaLabel={props.title}
            />
          ) : null}
        </div>
      ) : null}
      {props.showLegend ? <ChartLegend items={props.legend} /> : null}
    </figure>
  );
}

Object.assign(Chart, { Legend: ChartLegend, ChartLegend, Bar: ChartBar, ChartBar, Line: ChartLine, ChartLine, Pie: ChartPie, ChartPie });

export default Chart;
