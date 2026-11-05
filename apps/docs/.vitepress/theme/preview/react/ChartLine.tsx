import * as React from "react";

export interface ChartPoint {
  label: string;
  value?: number;
  values?: number[];
}
export interface ChartLineProps {
  data?: ChartPoint[];
  area?: boolean;
  showGridLines?: boolean;
  showDataLabels?: boolean;
  showAxisLabels?: boolean;
  showTooltip?: boolean;
  strokeClass?: string;
  fillClass?: string;
  ariaLabel?: string;
  className?: string;
}

import { cn, getChartLineState, bindControllerProps } from "./utils";

function ChartLine(props: ChartLineProps) {
  props = {
    data: [],
    area: false,
    showGridLines: true,
    showDataLabels: false,
    showAxisLabels: true,
    showTooltip: true,
    strokeClass: "stroke-chart-series-1",
    fillClass: "fill-chart-series-1",
    ariaLabel: "Line chart",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn("flex w-full flex-col gap-2", props.className)}
    >
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
            <div className="border-t border-border-subtle" />
            <div className="border-t border-border-subtle" />
            <div className="border-t border-border-subtle" />
            <div className="border-t border-border-subtle" />
            <div className="border-t border-border-subtle" />
          </div>
        ) : null}
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {getChartLineState(
            props.data,
            props.strokeClass,
            props.fillClass
          ).lines?.map((line) => (
            <g key={line.key}>
              {props.area ? (
                <polygon
                  className={cn(line.fillClass, "opacity-20")}
                  points={line.areaPoints}
                />
              ) : null}
              <polyline
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className={line.strokeClass}
                points={line.linePoints}
              />
            </g>
          ))}
        </svg>
        {getChartLineState(
          props.data,
          props.strokeClass,
          props.fillClass
        ).points?.map((point) => (
          <div
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none"
            key={point.key}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
            tabIndex={0}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-transform duration-150 group-hover:scale-150 group-focus:scale-150",
                  props.fillClass
                    ? props.fillClass.replace("fill-", "bg-")
                    : "bg-chart-series-1"
                )}
              />
            </div>
            {props.showTooltip ? (
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 invisible opacity-0 scale-95 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100 flex flex-col gap-0.5 rounded-lg border border-border-default bg-background-default px-2.5 py-1.5 shadow-lg backdrop-blur-sm min-w-20 whitespace-nowrap"
              >
                <span className="text-xs font-medium text-foreground-muted">
                  {point.label}
                </span>
                {point.valuesList?.map((valItem) => (
                  <div className="flex items-center gap-1.5" key={valItem.key}>
                    <span
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        valItem.colorClass
                      )}
                    />
                    <span className="text-xs font-bold text-foreground-default">
                      {valItem.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {props.showAxisLabels ? (
        <div className="flex w-full items-start gap-2">
          {getChartLineState(
            props.data,
            props.strokeClass,
            props.fillClass
          ).points?.map((point) => (
            <span
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
              key={point.key}
            >
              {props.showDataLabels ? (
                <span className="text-xs font-medium text-foreground-default">
                  {point.value}
                </span>
              ) : null}
              <span className="w-full truncate text-xs text-foreground-muted">
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
