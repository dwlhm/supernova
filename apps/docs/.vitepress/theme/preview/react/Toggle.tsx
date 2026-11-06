"use client";
import * as React from "react";

export interface ToggleProps {
  pressed?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  showText?: boolean;
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  onPressedChange?: (pressed: boolean) => void;
}

import { cn, cva, ICON_PATHS, bindControllerProps } from "./utils";

function Toggle(props: ToggleProps) {
  props = {
    pressed: false,
    disabled: false,
    size: "medium",
    showText: false,
    showIcon: true,
    className: "",
    ariaLabel: "Toggle",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <button
      type="button"
      data-ctrl={typeof bindControllerProps}
      aria-pressed={props.pressed}
      aria-label={props.ariaLabel}
      disabled={props.disabled}
      className={cn(
        "inline-flex flex-row items-center justify-center rounded-lg text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
        props.showText
          ? cva(
              props.size,
              {
                small: "px-2 py-1 gap-1.5 text-xs",
                medium: "px-3 py-1.5 gap-2 text-sm",
                large: "px-4 py-2 gap-2.5 text-base",
              },
              "medium"
            )
          : cva(
              props.size,
              {
                small: "h-4 w-4 gap-0.5 px-0.5 py-0.5",
                medium: "h-6 w-6 gap-1 px-1 py-1",
                large: "h-9 w-9 gap-1 px-2 py-2",
              },
              "medium"
            ),
        props.pressed ? "bg-background-muted shadow-sm" : "bg-transparent",
        props.className
      )}
      onClick={(event) =>
        !props.disabled &&
        props.onPressedChange &&
        props.onPressedChange(!props.pressed)
      }
    >
      {props.showIcon ? (
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
                small: "h-3 w-3",
                medium: "h-4 w-4",
                large: "h-5 w-5",
              },
              "medium"
            )
          )}
        >
          <path strokeLinecap="round" d={ICON_PATHS.plus} />
        </svg>
      ) : null}
      {props.children ? (
        <span className="truncate font-medium">{props.children}</span>
      ) : null}
    </button>
  );
}

export default Toggle;
