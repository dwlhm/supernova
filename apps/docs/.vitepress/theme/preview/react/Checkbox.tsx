"use client";
import * as React from "react";

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

import { cn } from "./utils";

function Checkbox(props: CheckboxProps) {
  props = {
    checked: false,
    disabled: false,
    size: "medium",
    label: "Label",
    leftLabel: false,
    rightLabel: true,
    name: "checkbox",
    value: "",
    className: "",
    ...props,
  };
  function boxClasses() {
    switch (props.size) {
      case "small":
        return "h-4 w-4 rounded-rounded-sm";
      case "large":
        return "h-6 w-6 rounded-rounded-lg";
      case "medium":
      default:
        return "h-5 w-5 rounded-rounded-md";
    }
  }

  function iconClasses() {
    switch (props.size) {
      case "small":
        return "h-3 w-3";
      case "large":
        return "h-4 w-4";
      case "medium":
      default:
        return "h-3.5 w-3.5";
    }
  }

  function gapClasses() {
    switch (props.size) {
      case "small":
        return "gap-1.5";
      case "large":
        return "gap-2.5";
      case "medium":
      default:
        return "gap-2";
    }
  }

  function hasLabel() {
    return props.label !== "";
  }

  function handleChange() {
    if (props.disabled) {
      return;
    }
    if (props.onCheckedChange) {
      props.onCheckedChange(!props.checked);
    }
  }

  return (
    <label
      className={cn(
        "inline-flex items-center",
        gapClasses(),
        props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        props.className
      )}
    >
      {props.leftLabel && hasLabel() ? (
        <span className="text-sm text-components-checkbox-all-color-label-foreground-default">
          {props.label}
        </span>
      ) : null}
      <span className="relative inline-flex shrink-0 items-center justify-center">
        <input
          type="checkbox"
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
          name={props.name}
          value={props.value}
          checked={props.checked}
          disabled={props.disabled}
          aria-label={hasLabel() ? props.label : "Checkbox"}
          onChange={(event) => handleChange()}
        />
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",
            boxClasses(),
            props.checked
              ? "border-components-checkbox-on-color-container-background-default bg-components-checkbox-on-color-container-background-default text-components-checkbox-on-color-icon-foreground-default"
              : "border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default"
          )}
        >
          {props.checked ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              className={cn("shrink-0", iconClasses())}
            >
              <path
                d="M5 13l4 4L19 7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </span>
      {props.rightLabel && hasLabel() ? (
        <span className="text-sm text-components-checkbox-all-color-label-foreground-default">
          {props.label}
        </span>
      ) : null}
    </label>
  );
}

export default Checkbox;
