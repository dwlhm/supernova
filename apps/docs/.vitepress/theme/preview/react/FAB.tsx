"use client";
import * as React from "react";

export interface FABProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "regular" | "large" | "extended";
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

import { cn, cva, ICON_PATHS } from "./utils";

function FAB(props: FABProps) {
  props = {
    type: "button",
    variant: "primary",
    size: "small",
    disabled: false,
    ariaLabel: "Action",
    className: "",
    ...props,
  };
  return (
    <button
      type={props.type || "button"}
      aria-label={props.ariaLabel || "Action"}
      disabled={props.disabled}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
        cva(
          props.variant,
          {
            primary:
              "bg-primary-default text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed",
            secondary:
              "bg-secondary-default text-secondary-foreground hover:bg-secondary-hover active:bg-background-interactive",
            outline:
              "border border-border-default bg-background-default text-foreground-default hover:bg-background-muted active:bg-background-interactive",
          },
          "primary"
        ),
        cva(
          props.size,
          {
            small: "h-10 w-10",
            regular: "h-14 w-14",
            large: "h-24 w-24",
            extended: "h-14 w-auto gap-3 px-4",
          },
          "small"
        ),
        props.className
      )}
      onClick={(event) => !props.disabled && props.onClick && props.onClick()}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={cn(
          "shrink-0",
          cva(
            props.size,
            {
              small: "h-4 w-4",
              regular: "h-5 w-5",
              large: "h-7 w-7",
              extended: "h-5 w-5",
            },
            "small"
          )
        )}
      >
        <path strokeLinecap="round" d={ICON_PATHS.plus} />
      </svg>
      {props.size === "extended" ? (
        <span className="truncate text-sm font-medium">{props.children}</span>
      ) : null}
    </button>
  );
}

export default FAB;
