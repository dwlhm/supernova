"use client";
import * as React from "react";

export interface RadioButtonProps {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

import { cn, cva, getChoiceState, bindControllerProps } from "./utils";

function RadioButton(props: RadioButtonProps) {
  props = {
    id: "radio-button",
    checked: false,
    disabled: false,
    required: false,
    size: "medium",
    label: "Label",
    leftLabel: false,
    rightLabel: false,
    name: "radio-group",
    value: "",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <label
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "inline-flex items-center",
        cva(
          props.size,
          {
            small: "gap-1.5",
            medium: "gap-2",
            large: "gap-2.5",
          },
          "medium"
        ),
        props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        props.className
      )}
    >
      {getChoiceState(props).showLeft ? (
        <span className="text-sm text-foreground-default">{props.label}</span>
      ) : null}
      <span className="relative inline-flex shrink-0 items-center justify-center">
        <input
          type="radio"
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-not-allowed"
          id={props.id}
          name={props.name}
          value={props.value}
          checked={props.checked}
          disabled={props.disabled}
          required={props.required}
          aria-label={
            !getChoiceState(props).showLeft && !getChoiceState(props).showRight
              ? props.label || "Option"
              : undefined
          }
          onChange={(event) =>
            !props.disabled &&
            props.onChange &&
            props.onChange(props.value || props.label || "")
          }
        />
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center rounded-full border bg-background-default shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",
            cva(
              props.size,
              {
                small: "h-3 w-3",
                medium: "h-3.5 w-3.5",
                large: "h-4 w-4",
              },
              "medium"
            ),
            props.checked ? "border-primary-default" : "border-border-default"
          )}
        >
          {props.checked ? (
            <span
              className={cn(
                "rounded-full bg-primary-default",
                cva(
                  props.size,
                  {
                    small: "h-1.5 w-1.5",
                    medium: "h-2 w-2",
                    large: "h-2.5 w-2.5",
                  },
                  "medium"
                )
              )}
            />
          ) : null}
        </span>
      </span>
      {getChoiceState(props).showRight ? (
        <span className="text-sm text-foreground-default">{props.label}</span>
      ) : null}
    </label>
  );
}

export default RadioButton;
