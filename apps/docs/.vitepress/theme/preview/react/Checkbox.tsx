"use client";
import * as React from "react";

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

import {
  cn,
  cva,
  getChoiceState,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function Checkbox(props: CheckboxProps) {
  props = {
    id: "checkbox",
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    size: "medium",
    label: "Label",
    leftLabel: false,
    rightLabel: false,
    name: "checkbox",
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
          type="checkbox"
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
          id={props.id}
          name={props.name}
          value={props.value}
          checked={props.checked}
          disabled={props.disabled}
          required={props.required}
          aria-checked={props.indeterminate ? "mixed" : props.checked}
          aria-label={
            !getChoiceState(props).showLeft && !getChoiceState(props).showRight
              ? props.label || "Checkbox"
              : undefined
          }
          onChange={(event) =>
            !props.disabled &&
            props.onCheckedChange &&
            props.onCheckedChange(!props.checked)
          }
        />
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center rounded-sm border shadow-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",
            cva(
              props.size,
              {
                small: "h-3.5 w-3.5",
                medium: "h-4 w-4",
                large: "h-5 w-5",
              },
              "medium"
            ),
            props.checked || props.indeterminate
              ? "border-primary-default bg-primary-default text-primary-foreground"
              : "border-border-default bg-background-default"
          )}
        >
          {props.checked || props.indeterminate ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={cn(
                "shrink-0",
                cva(
                  props.size,
                  {
                    small: "h-2.5 w-2.5",
                    medium: "h-3 w-3",
                    large: "h-3.5 w-3.5",
                  },
                  "medium"
                )
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={props.indeterminate ? ICON_PATHS.minus : ICON_PATHS.check}
              />
            </svg>
          ) : null}
        </span>
      </span>
      {getChoiceState(props).showRight ? (
        <span className="text-sm text-foreground-default">{props.label}</span>
      ) : null}
    </label>
  );
}

export default Checkbox;
