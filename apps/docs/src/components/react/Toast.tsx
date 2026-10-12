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

import { cn } from "./utils";

function Toast(props: ToastProps) {
  props = {
    type: "default",
    title: "Toast Text",
    description: "Toast description text here",
    showDescription: false,
    actionText: "Undo",
    showAction: false,
    showClose: false,
    timestamp: "",
    showTimestamp: true,
    className: "",
    ...props,
  };
  function role() {
    return props.type === "error" ? "alert" : "status";
  }

  function iconContainerClasses() {
    switch (props.type) {
      case "success":
        return "bg-components-toast-success-color-icon-container-background-default";
      case "error":
        return "bg-components-toast-error-color-icon-container-background-default";
      case "warning":
        return "bg-components-toast-warning-color-icon-container-background-default";
      case "info":
        return "bg-components-toast-info-color-icon-container-background-default";
      case "default":
      default:
        return "bg-components-toast-default-color-icon-container-background-default";
    }
  }

  function titleClasses() {
    switch (props.type) {
      case "success":
        return "text-components-toast-success-color-title-text-default";
      case "error":
        return "text-components-toast-error-color-title-text-default";
      case "warning":
        return "text-components-toast-warning-color-title-text-default";
      case "info":
        return "text-components-toast-info-color-title-text-default";
      case "default":
      default:
        return "text-components-toast-default-color-title-text-default";
    }
  }

  function handleAction() {
    if (props.onAction) {
      props.onAction();
    }
  }

  function handleClose() {
    if (props.onClose) {
      props.onClose();
    }
  }

  return (
    <div
      role={role()}
      className={cn(
        "flex w-full max-w-md items-center gap-1.5 rounded-rounded-full border border-border-subtle bg-components-toast-default-color-container-background-default px-3 py-2 shadow-lg transition-colors hover:bg-components-toast-default-color-container-background-hover",
        props.className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full",
          iconContainerClasses()
        )}
      >
        {props.type === "success" ? (
          <svg
            className="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : null}
        {props.type === "error" ? (
          <svg
            className="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 8v5" stroke-linecap="round" />
            <circle cx="12" cy="16.5" r="0.75" />
          </svg>
        ) : null}
        {props.type === "warning" ? (
          <svg
            className="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M12 4l9 16H3z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M12 10v4" stroke-linecap="round" />
          </svg>
        ) : null}
        {props.type === "info" ? (
          <svg
            className="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" stroke-linecap="round" />
            <circle cx="12" cy="8" r="0.75" />
          </svg>
        ) : null}
        {props.type === "default" ? (
          <svg
            className="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M10 21h4" stroke-linecap="round" />
            <path
              d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("truncate text-sm font-medium", titleClasses())}>
          {props.title}
        </span>
        {props.showDescription ? (
          <span className="truncate text-xs text-components-toast-default-color-description-text-default">
            {props.description}
          </span>
        ) : null}
      </span>
      {props.showTimestamp && props.timestamp !== "" ? (
        <span className="shrink-0 text-xs text-components-toast-default-color-timestamp-text-default">
          {props.timestamp}
        </span>
      ) : null}
      {props.showAction ? (
        <button
          type="button"
          className="shrink-0 rounded-rounded-sm px-2 py-1 text-xs font-medium text-components-toast-default-color-action-text-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={(event) => handleAction()}
        >
          {props.actionText}
        </button>
      ) : null}
      {props.showClose ? (
        <button
          type="button"
          aria-label="Dismiss notification"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full text-components-toast-default-color-close-text-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={(event) => handleClose()}
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export default Toast;
