"use client";
import * as React from "react";

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
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
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

import { cn, cva, ICON_PATHS } from "./utils";

function Button(props: ButtonProps) {
  props = {
    type: "button",
    variant: "primary",
    size: "regular",
    roundness: "default",
    disabled: false,
    showLeftIcon: false,
    showRightIcon: false,
    ariaLabel: "",
    className: "",
    ...props,
  };
  return (
    <button
      type={props.type || "button"}
      disabled={props.disabled}
      aria-disabled={props.disabled}
      aria-label={props.ariaLabel || undefined}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none",
        cva(
          props.variant,
          {
            primary:
              "bg-primary-default text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-pressed",
            secondary:
              "bg-secondary-default text-secondary-foreground shadow-xs hover:bg-secondary-hover active:bg-background-interactive focus-visible:bg-secondary-hover",
            outline:
              "border border-border-default bg-background-default text-foreground-default shadow-xs hover:bg-background-muted active:bg-background-interactive focus-visible:border-primary-border-emphasis",
            ghost:
              "bg-ghost-default text-foreground-default hover:bg-ghost-hover",
            destructive:
              "bg-destructive-background text-primary-foreground shadow-xs hover:bg-destructive-hover active:bg-destructive-pressed focus-visible:ring-focus-ring-error",
            link: "bg-ghost-default text-primary-muted underline-offset-4 hover:underline hover:text-primary-on-surface",
          },
          "primary"
        ),
        cva(
          props.size,
          {
            large: "h-10 px-6 text-base gap-2",
            regular: "h-9 px-4 text-sm gap-2",
            small: "h-8 px-3 text-sm gap-1.5",
            mini: "h-6 px-2 text-xs gap-1.5",
          },
          "regular"
        ),
        props.roundness === "round" ? "rounded-full" : "rounded-lg",
        props.className
      )}
      onClick={(event) => !props.disabled && props.onClick && props.onClick()}
    >
      {props.showLeftIcon ? (
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" d={ICON_PATHS.plus} />
        </svg>
      ) : null}
      {props.children}
      {props.showRightIcon ? (
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={ICON_PATHS.arrowRight}
          />
        </svg>
      ) : null}
    </button>
  );
}

export default Button;
