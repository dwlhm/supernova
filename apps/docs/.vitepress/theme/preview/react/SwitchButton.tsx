"use client";
import * as React from "react";

export interface SwitchButtonProps {
  id?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

import { cn, cva, getChoiceState, bindControllerProps } from "./utils";

function SwitchButton(props: SwitchButtonProps) {
  props = {
    id: "switch-button",
    name: "switch",
    value: "on",
    checked: false,
    disabled: false,
    size: "medium",
    label: "Label",
    leftLabel: false,
    rightLabel: false,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <span
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "inline-flex items-center gap-2",
        props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        props.className
      )}
      onClick={(event) =>
        !props.disabled &&
        props.onCheckedChange &&
        props.onCheckedChange(!props.checked)
      }
    >
      {getChoiceState(props).showLeft ? (
        <span className="text-sm text-foreground-default">{props.label}</span>
      ) : null}
      <button
        type="button"
        role="switch"
        id={props.id}
        aria-checked={props.checked}
        aria-label={
          getChoiceState(props).hasLabel ? props.label : "Toggle setting"
        }
        disabled={props.disabled}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none",
          cva(
            props.size,
            {
              small: "h-5 w-9 p-0.5",
              medium: "h-6 w-11 p-0.5",
              large: "h-8 w-[52px] p-1",
            },
            "medium"
          ),
          props.checked ? "bg-primary-default" : "bg-background-interactive"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "inline-block rounded-full bg-background-default shadow-sm transition-transform",
            cva(
              props.size,
              {
                small: "h-4 w-4",
                medium: "h-5 w-5",
                large: "h-6 w-6",
              },
              "medium"
            ),
            props.checked
              ? cva(
                  props.size,
                  {
                    small: "translate-x-4",
                    medium: "translate-x-5",
                    large: "translate-x-5",
                  },
                  "medium"
                )
              : "translate-x-0"
          )}
        />
      </button>
      {getChoiceState(props).showRight ? (
        <span className="text-sm text-foreground-default">{props.label}</span>
      ) : null}
    </span>
  );
}

export default SwitchButton;
