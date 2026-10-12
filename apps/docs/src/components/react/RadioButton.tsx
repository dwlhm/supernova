"use client";
import * as React from "react";

export interface RadioButtonProps {
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

import { cn } from "./utils";

function RadioButton(props: RadioButtonProps) {
  props = {
    checked: false,
    disabled: false,
    size: "medium",
    label: "Label",
    leftLabel: false,
    rightLabel: true,
    name: "radio-group",
    value: "",
    className: "",
    ...props,
  };
  function circleClasses() {
    switch (props.size) {
      case "small":
        return "h-4 w-4";
      case "large":
        return "h-6 w-6";
      case "medium":
      default:
        return "h-5 w-5";
    }
  }

  function dotClasses() {
    switch (props.size) {
      case "small":
        return "h-1.5 w-1.5";
      case "large":
        return "h-2.5 w-2.5";
      case "medium":
      default:
        return "h-2 w-2";
    }
  }

  function hasLabel() {
    return props.label !== "";
  }

  function handleChange() {
    if (props.disabled) {
      return;
    }
    if (props.onChange) {
      props.onChange(props.value);
    }
  }

  return (
    <label
      className={cn(
        "inline-flex items-center gap-2",
        props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        props.className
      )}
    >
      {props.leftLabel && hasLabel() ? (
        <span className="text-sm text-components-radio-button-all-color-label-foreground-default">
          {props.label}
        </span>
      ) : null}
      <span className="relative inline-flex shrink-0 items-center justify-center">
        <input
          type="radio"
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-rounded-full opacity-0 disabled:cursor-not-allowed"
          name={props.name}
          value={props.value}
          checked={props.checked}
          disabled={props.disabled}
          aria-label={hasLabel() ? props.label : "Option"}
          onChange={(event) => handleChange()}
        />
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center rounded-rounded-full border bg-components-radio-button-all-color-circle-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",
            circleClasses(),
            props.checked
              ? "border-components-radio-button-on-color-indicator-fill-default"
              : "border-components-radio-button-all-color-circle-border-default"
          )}
        >
          {props.checked ? (
            <span
              className={cn(
                "rounded-rounded-full bg-components-radio-button-on-color-indicator-fill-default",
                dotClasses()
              )}
            />
          ) : null}
        </span>
      </span>
      {props.rightLabel && hasLabel() ? (
        <span className="text-sm text-components-radio-button-all-color-label-foreground-default">
          {props.label}
        </span>
      ) : null}
    </label>
  );
}

export default RadioButton;
