"use client";
import * as React from "react";

export interface ButtonProps {
  label?: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "large" | "regular" | "small" | "mini";
  roundness?: "default" | "round";
  disabled?: boolean;
  showLabel?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  className?: string;
  children?: any;
  onClick?: () => void;
}

import { cn } from "./utils";

function Button(props: ButtonProps) {
  props = {
    label: "Label",
    variant: "primary",
    size: "regular",
    roundness: "default",
    disabled: false,
    showLabel: true,
    showLeftIcon: false,
    showRightIcon: false,
    className: "",
    ...props,
  };
  function variantClasses() {
    switch (props.variant) {
      case "secondary":
        return "bg-components-button-secondary-color-container-background-default text-components-button-secondary-color-label-foreground-default hover:bg-components-button-secondary-color-container-background-hover active:bg-components-button-secondary-color-container-background-pressed";
      case "outline":
        return "bg-components-button-outline-color-container-background-default text-components-button-outline-color-label-foreground-default border border-components-button-outline-color-container-border-default hover:bg-components-button-outline-color-container-background-hover active:bg-components-button-outline-color-container-background-pressed";
      case "ghost":
        return "bg-ghost-default text-foreground-default hover:bg-ghost-hover";
      case "destructive":
        return "bg-components-button-destructive-color-container-background-default text-components-button-destructive-color-label-foreground-default hover:bg-components-button-destructive-color-container-background-hover active:bg-components-button-destructive-color-container-background-pressed";
      case "link":
        return "bg-transparent text-components-button-link-color-label-foreground-default underline-offset-4 hover:underline hover:text-components-button-link-color-label-foreground-hover";
      case "primary":
      default:
        return "bg-components-button-primary-color-container-background-default text-components-button-primary-color-label-foreground-default hover:bg-components-button-primary-color-container-background-hover active:bg-components-button-primary-color-container-background-pressed";
    }
  }

  function sizeClasses() {
    switch (props.size) {
      case "large":
        return "h-10 px-6 text-base gap-2";
      case "small":
        return "h-8 px-3 text-sm gap-1.5";
      case "mini":
        return "h-6 px-2 text-xs gap-1.5";
      case "regular":
      default:
        return "h-9 px-4 text-sm gap-2";
    }
  }

  function roundnessClasses() {
    return props.roundness === "round"
      ? "rounded-rounded-full"
      : "rounded-rounded-lg";
  }

  function handleClick() {
    if (!props.disabled && props.onClick) {
      props.onClick();
    }
  }

  return (
    <button
      type="button"
      disabled={props.disabled}
      aria-disabled={props.disabled}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none",
        variantClasses(),
        sizeClasses(),
        roundnessClasses(),
        props.className
      )}
      onClick={(event) => handleClick()}
    >
      {props.showLeftIcon ? (
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="M12 5v14M5 12h14" stroke-linecap="round" />
        </svg>
      ) : null}
      {props.showLabel ? <span className="truncate">{props.label}</span> : null}
      {props.children}
      {props.showRightIcon ? (
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

export default Button;
