"use client";
import * as React from "react";

export interface SwitchButtonProps {
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

import { cn } from "./utils";

function SwitchButton(props: SwitchButtonProps) {
  props = {
    checked: false,
    disabled: false,
    size: "medium",
    label: "Label",
    leftLabel: false,
    rightLabel: true,
    className: "",
    ...props,
  };
  function trackClasses() {
    switch (props.size) {
      case "small":
        return "h-5 w-9 p-0.5";
      case "large":
        return "h-7 w-12 p-0.5";
      case "medium":
      default:
        return "h-6 w-11 p-0.5";
    }
  }

  function thumbClasses() {
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

  function thumbTransform() {
    if (!props.checked) {
      return "translate-x-0";
    }
    switch (props.size) {
      case "small":
        return "translate-x-4";
      case "large":
        return "translate-x-5";
      case "medium":
      default:
        return "translate-x-5";
    }
  }

  function trackColor() {
    return props.checked
      ? "bg-components-switch-on-color-track-background-default"
      : "bg-components-switch-off-color-track-background-default";
  }

  function hasLabel() {
    return props.label !== "";
  }

  function toggle() {
    if (props.disabled) {
      return;
    }
    if (props.onCheckedChange) {
      props.onCheckedChange(!props.checked);
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        props.disabled && "opacity-50",
        props.className
      )}
    >
      {props.leftLabel && hasLabel() ? (
        <span className="text-sm text-foreground-default">{props.label}</span>
      ) : null}
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        aria-label={hasLabel() ? props.label : "Toggle setting"}
        disabled={props.disabled}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none",
          trackClasses(),
          trackColor()
        )}
        onClick={(event) => toggle()}
      >
        <span
          aria-hidden="true"
          className={cn(
            "inline-block rounded-rounded-full bg-components-switch-on-color-thumb-background-default shadow-sm transition-transform",
            thumbClasses(),
            thumbTransform()
          )}
        />
      </button>
      {props.rightLabel && hasLabel() ? (
        <span className="text-sm text-foreground-default">{props.label}</span>
      ) : null}
    </span>
  );
}

export default SwitchButton;
