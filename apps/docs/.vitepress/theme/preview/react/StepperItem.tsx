import * as React from "react";

export interface StepperItemProps {
  step?: number;
  status?: "completed" | "active" | "upcoming";
  orientation?: "horizontal" | "vertical";
  isLast?: boolean;
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, ICON_PATHS } from "./utils";

function StepperItem(props: StepperItemProps) {
  props = {
    step: 1,
    status: "upcoming",
    orientation: "horizontal",
    isLast: false,
    className: "",
    ...props,
  };
  return (
    <li
      className={cn(
        "flex items-start justify-start",
        props.orientation === "vertical"
          ? "flex-col"
          : !props.isLast
          ? "flex-1 flex-row"
          : "flex-row",
        props.className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-start gap-2",
          props.orientation === "vertical" ? "flex-row" : "flex-col"
        )}
      >
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 flex-row items-center justify-center rounded-full text-center text-xs font-semibold",
            cva(
              props.status,
              {
                completed: "bg-success-subtle text-success-foreground",
                active: "bg-primary-default text-primary-foreground",
                upcoming: "bg-background-muted text-foreground-muted",
              },
              "upcoming"
            )
          )}
          aria-current={props.status === "active" ? "step" : undefined}
        >
          {props.status === "completed" ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={ICON_PATHS.check}
              />
            </svg>
          ) : null}
          {props.status !== "completed" ? <>{props.step}</> : null}
        </span>
        <span
          className={cn(
            "text-sm",
            props.orientation === "horizontal" && "text-center",
            cva(
              props.status,
              {
                completed: "font-medium text-foreground-default",
                active: "font-semibold text-foreground-default",
                upcoming: "font-medium text-foreground-muted",
              },
              "upcoming"
            )
          )}
        >
          {props.children}
        </span>
      </div>
      {!props.isLast ? (
        <div
          aria-hidden="true"
          className={cn(
            "flex items-center justify-center",
            props.orientation === "vertical"
              ? "h-8 w-8 flex-row"
              : "h-8 flex-1 flex-col"
          )}
        >
          <span
            className={cn(
              props.orientation === "vertical" ? "h-8 w-0.5" : "h-0.5 w-full",
              props.status === "completed"
                ? "bg-success-foreground"
                : "bg-border-default"
            )}
          />
        </div>
      ) : null}
    </li>
  );
}

export default StepperItem;
