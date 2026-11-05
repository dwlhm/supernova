import * as React from "react";

export interface ChartPoint {
  label: string;
  value: number;
}
export interface ChartPieProps {
  data?: ChartPoint[];
  innerRadius?: number;
  showTooltip?: boolean;
  ariaLabel?: string;
  className?: string;
}

import { cn, cva, getChartPieState, bindControllerProps } from "./utils";

function ChartPie(props: ChartPieProps) {
  props = {
    data: [],
    innerRadius: 0,
    showTooltip: true,
    ariaLabel: "Pie chart",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "relative flex w-full items-center justify-center",
        props.className
      )}
    >
      <div className="relative flex items-center justify-center">
        <svg
          className="h-44 w-44 shrink-0 -rotate-90"
          viewBox="0 0 100 100"
          role="img"
          aria-label={props.ariaLabel}
        >
          {getChartPieState(props.data, props.innerRadius).slices?.map(
            (slice) => (
              <circle
                cx="50"
                cy="50"
                fill="none"
                key={slice.key}
                r={getChartPieState(props.data, props.innerRadius).ringRadius}
                className={cva(
                  String(slice.seriesIndex),
                  {
                    "0": "stroke-chart-series-1",
                    "1": "stroke-chart-series-2",
                    "2": "stroke-chart-series-3",
                    "3": "stroke-chart-series-4",
                    "4": "stroke-chart-series-5",
                  },
                  "0"
                )}
                strokeWidth={
                  getChartPieState(props.data, props.innerRadius).ringWidth
                }
                strokeDasharray={slice.dashArray}
                strokeDashoffset={slice.dashOffset}
              />
            )
          )}
        </svg>
        {props.innerRadius > 0 && props.showTooltip ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-2">
            <span className="w-16 truncate text-xs font-medium text-foreground-muted">
              Total
            </span>
            <span className="w-16 truncate text-sm font-bold text-foreground-default">
              {getChartPieState(props.data, props.innerRadius).total}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ChartPie;
