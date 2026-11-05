import * as React from "react";

export interface ChartPoint {
  label: string;
  value?: number;
  values?: number[];
}
export interface ChartBarProps {
  data?: ChartPoint[];
  colorClass?: string;
  showGridLines?: boolean;
  showDataLabels?: boolean;
  showAxisLabels?: boolean;
  showTooltip?: boolean;
  ariaLabel?: string;
  className?: string;
}

import { cn, getChartBarState, bindControllerProps } from "./utils";

function ChartBar(props: ChartBarProps) {
  props = {
    data: [],
    colorClass: "bg-chart-series-1",
    showGridLines: true,
    showDataLabels: true,
    showAxisLabels: true,
    showTooltip: true,
    ariaLabel: "Bar chart",
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
        className="relative flex h-44 w-full items-end gap-2"
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
        {getChartBarState(props.data, props.colorClass).rows?.map((point) => (
          <div
            className="group relative flex h-full flex-1 items-end justify-center gap-1 cursor-pointer outline-none"
            key={point.label}
            tabIndex={0}
          >
            {point.bars?.map((bar) => (
              <div
                key={bar.key}
                className={cn(
                  "w-full rounded-sm transition-all duration-150 group-hover:brightness-110 group-focus:brightness-110",
                  bar.colorClass
                )}
                style={{
                  height: bar.height,
                }}
              />
            ))}
            {props.showTooltip ? (
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 invisible opacity-0 scale-95 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100 flex flex-col gap-0.5 rounded-lg border border-border-default bg-background-default px-2.5 py-1.5 shadow-lg backdrop-blur-sm min-w-20 whitespace-nowrap"
              >
                <span className="text-xs font-medium text-foreground-muted">
                  {point.label}
                </span>
                {point.bars?.map((bar) => (
                  <div className="flex items-center gap-1.5" key={bar.key}>
                    <span
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        bar.colorClass
                      )}
                    />
                    <span className="text-xs font-bold text-foreground-default">
                      {bar.value}
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
          {getChartBarState(props.data, props.colorClass).rows?.map((point) => (
            <span
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
              key={point.label}
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

export default ChartBar;
