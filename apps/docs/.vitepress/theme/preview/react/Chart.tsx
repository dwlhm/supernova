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
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function Chart(props: ChartProps) {
  props = { title: "", description: "", className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <figure
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex w-full flex-col items-start justify-start gap-4 rounded-lg border border-border-default bg-background-default px-5 py-5 shadow-sm",
        props.className
      )}
    >
      {props.title || props.description ? (
        <figcaption className="flex flex-col items-start justify-start gap-1">
          {props.title ? (
            <span className="text-base leading-6 font-semibold text-foreground-default">
              {props.title}
            </span>
          ) : null}
          {props.description ? (
            <span className="text-sm font-normal text-foreground-muted">
              {props.description}
            </span>
          ) : null}
        </figcaption>
      ) : null}
      {props.children}
    </figure>
  );
}

export default Chart;
