"use client";
import * as React from "react";

export interface ToastProps {
  type?: "default" | "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  showDescription?: boolean;
  actionText?: string;
  showAction?: boolean;
  showClose?: boolean;
  timestamp?: string;
  showTimestamp?: boolean;
  className?: string;
  onAction?: () => void;
  onClose?: () => void;
}

import {
  cn,
  cva,
  getToastIconPath,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function Toast(props: ToastProps) {
  props = {
    type: "default",
    title: "Toast Text",
    description: "Toast description text here",
    showDescription: false,
    actionText: "Undo",
    showAction: false,
    showClose: false,
    timestamp: "11.29.45 AM",
    showTimestamp: true,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      role={props.type === "error" ? "alert" : "status"}
      className={cn(
        "flex w-full max-w-md items-center gap-1.5 bg-background-default px-3 py-2 shadow-md transition-shadow hover:shadow-lg",
        props.showDescription ? "rounded-xl" : "rounded-full",
        props.className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full p-1.5",
          cva(
            props.type,
            {
              success: "bg-success-subtle text-success-foreground",
              error: "bg-destructive-subtle text-destructive-foreground",
              warning: "bg-warning-subtle text-warning-foreground",
              info: "bg-info-subtle text-info-foreground",
              default: "bg-background-muted text-foreground-default",
            },
            "default"
          )
        )}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={getToastIconPath(props.type)}
          />
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={cn(
            "truncate text-sm font-semibold",
            cva(
              props.type,
              {
                success: "text-success-foreground",
                error: "text-destructive-foreground",
                warning: "text-warning-foreground",
                info: "text-info-foreground",
                default: "text-foreground-default",
              },
              "default"
            )
          )}
        >
          {props.title}
        </span>
        {props.showDescription ? (
          <span className="text-xs text-foreground-muted">
            {props.description}
          </span>
        ) : null}
      </span>
      {props.showTimestamp && props.timestamp !== "" ? (
        <span className="shrink-0 text-xs text-foreground-muted">
          {props.timestamp}
        </span>
      ) : null}
      {props.showAction ? (
        <button
          type="button"
          className="shrink-0 rounded-md bg-secondary-default px-2 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={(event) => props.onAction && props.onAction()}
        >
          {props.actionText}
        </button>
      ) : null}
      {props.showClose ? (
        <button
          type="button"
          aria-label="Dismiss notification"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={(event) => props.onClose && props.onClose()}
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" d={ICON_PATHS.close} />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export default Toast;
