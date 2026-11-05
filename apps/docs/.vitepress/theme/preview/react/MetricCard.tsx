import * as React from "react";

export interface MetricCardProps {
  label?: string;
  value?: string;
  showValue?: boolean;
  trendText?: string;
  showTrend?: boolean;
  trendDirection?: "up" | "down" | "neutral";
  descriptionText?: string;
  showDescription?: boolean;
  showIcon?: boolean;
  showStatus?: boolean;
  statusLabel?: string;
  statusVariant?: "default" | "success" | "warning" | "error" | "info";
  showProgress?: boolean;
  progress?: number;
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, getProgressState, bindControllerProps } from "./utils";

function MetricCard(props: MetricCardProps) {
  props = {
    label: "Total Revenue",
    value: "$45,231.89",
    showValue: true,
    trendText: "+20.1%",
    showTrend: true,
    trendDirection: "up",
    descriptionText: "from last month",
    showDescription: true,
    showIcon: true,
    showStatus: true,
    statusLabel: "On track",
    statusVariant: "default",
    showProgress: false,
    progress: 0,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <article
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm",
        props.className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex-1 truncate text-xs font-medium text-foreground-muted">
          {props.label}
        </span>
        {props.showStatus ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium leading-4",
              cva(
                props.statusVariant,
                {
                  success: "bg-success-subtle text-success-foreground",
                  warning: "bg-warning-subtle text-warning-foreground",
                  error: "bg-destructive-subtle text-destructive-foreground",
                  info: "bg-info-subtle text-info-foreground",
                  default: "bg-background-muted text-foreground-muted",
                },
                "default"
              )
            )}
          >
            {props.statusLabel}
          </span>
        ) : null}
        {props.showIcon ? (
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background-muted p-1 text-foreground-default"
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M4 20V10M10 20V4M16 20v-7M22 20H2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : null}
      </div>
      {props.showValue ? (
        <p className="truncate text-xl leading-6 font-semibold text-foreground-default">
          {props.value}
        </p>
      ) : null}
      {props.showTrend || props.showDescription ? (
        <div className="flex flex-wrap items-center gap-1">
          {props.showTrend ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold leading-4",
                cva(
                  props.trendDirection,
                  {
                    down: "bg-destructive-subtle text-destructive-foreground",
                    neutral: "bg-background-muted text-foreground-muted",
                    up: "bg-success-subtle text-success-foreground",
                  },
                  "up"
                )
              )}
            >
              {props.trendText}
            </span>
          ) : null}
          {props.showDescription ? (
            <span className="truncate text-xs text-foreground-muted">
              {props.descriptionText}
            </span>
          ) : null}
        </div>
      ) : null}
      {props.showProgress ? (
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-background-muted"
          role="progressbar"
          aria-valuenow={getProgressState(props.progress).percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={props.label}
        >
          <div
            className="h-2 rounded-full bg-chart-series-1"
            style={getProgressState(props.progress).barStyle}
          />
        </div>
      ) : null}
      {props.children ? <div className="w-full">{props.children}</div> : null}
    </article>
  );
}

export default MetricCard;
