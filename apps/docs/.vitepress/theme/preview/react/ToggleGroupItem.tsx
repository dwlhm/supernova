"use client";
import * as React from "react";

export interface ToggleGroupItemProps {
  size?: "small" | "medium" | "large";
  pressed?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
  onPressedChange?: (pressed: boolean) => void;
}

import { cn, cva, bindControllerProps } from "./utils";

function ToggleGroupItem(props: ToggleGroupItemProps) {
  props = {
    size: "medium",
    pressed: false,
    disabled: false,
    ariaLabel: "Toggle option",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <button
      type="button"
      data-ctrl={typeof bindControllerProps}
      disabled={props.disabled}
      aria-pressed={props.pressed}
      aria-label={props.ariaLabel}
      className={cn(
        "inline-flex flex-row items-center justify-center gap-1 border-l border-border-default first:border-l-0 font-paragraph-weight-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
        cva(
          props.size,
          {
            small: "h-5 min-w-5 px-0.5 py-1 text-xs",
            medium: "h-6 min-w-6 px-1 py-1 text-xs",
            large: "h-9 min-w-9 px-2 py-2 text-sm",
          },
          "medium"
        ),
        props.pressed
          ? "bg-background-muted text-foreground-default"
          : "bg-background-default text-foreground-muted hover:bg-background-subtle hover:text-foreground-default",
        props.className
      )}
      onClick={(event) =>
        !props.disabled &&
        props.onPressedChange &&
        props.onPressedChange(!props.pressed)
      }
    >
      {props.children}
    </button>
  );
}

export default ToggleGroupItem;
