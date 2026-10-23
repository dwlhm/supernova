"use client";
import * as React from "react";

export interface FABProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "regular" | "large" | "extended";
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

import { cn } from "./utils";

function FAB(props: FABProps) {
  props = {
    variant: "primary",
    size: "regular",
    disabled: false,
    label: "Label",
    showLabel: true,
    ariaLabel: "",
    className: "",
    ...props,
  };
  function variantClasses() {
    switch (props.variant) {
      case "secondary":
        return "bg-components-fab-secondary-color-container-background-default text-components-fab-secondary-color-label-foreground-default hover:bg-components-fab-secondary-color-container-background-hover";
      case "outline":
        return "bg-components-fab-surface-color-container-background-default text-components-fab-surface-color-label-foreground-default border border-border-default hover:bg-components-fab-surface-color-container-background-hover";
      case "primary":
      default:
        return "bg-components-fab-primary-color-container-background-default text-components-fab-primary-color-label-foreground-default hover:bg-components-fab-primary-color-container-background-hover";
    }
  }

  function sizeClasses() {
    switch (props.size) {
      case "small":
        return "h-10 w-10";
      case "large":
        return "h-24 w-24";
      case "extended":
        return "h-14 w-auto gap-3 px-4";
      case "regular":
      default:
        return "h-14 w-14";
    }
  }

  function iconClasses() {
    switch (props.size) {
      case "small":
        return "h-4 w-4";
      case "large":
        return "h-7 w-7";
      case "regular":
      case "extended":
      default:
        return "h-5 w-5";
    }
  }

  function accessibleName() {
    return props.ariaLabel !== "" ? props.ariaLabel : props.label;
  }

  function handleClick() {
    if (!props.disabled && props.onClick) {
      props.onClick();
    }
  }

  return (
    <button
      type="button"
      aria-label={accessibleName()}
      disabled={props.disabled}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-rounded-full shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
        variantClasses(),
        sizeClasses(),
        props.className
      )}
      onClick={(event) => handleClick()}
    >
      {props.children ? <>{props.children}</> : null}
      {!props.children ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          className={cn("shrink-0", iconClasses())}
        >
          <path d="M12 5v14M5 12h14" stroke-linecap="round" />
        </svg>
      ) : null}
      {props.size === "extended" && props.showLabel ? (
        <span className="truncate text-sm font-medium">{props.label}</span>
      ) : null}
    </button>
  );
}

export default FAB;
