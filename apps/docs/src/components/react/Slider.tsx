"use client";
import * as React from "react";

export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  className?: string;
  onValueChange?: (value: number) => void;
}

import { cn } from "./utils";

function Slider(props: SliderProps) {
  props = {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    label: "Slider",
    showValue: false,
    className: "",
    ...props,
  };
  function percentage() {
    const range = props.max - props.min;
    if (range <= 0) {
      return 0;
    }
    const raw = ((props.value - props.min) / range) * 100;
    if (raw < 0) {
      return 0;
    }
    if (raw > 100) {
      return 100;
    }
    return raw;
  }

  function barStyle() {
    return {
      width: percentage() + "%",
    };
  }

  function thumbStyle() {
    return {
      left: percentage() + "%",
    };
  }

  function handleInput(rawValue: string) {
    if (props.disabled) {
      return;
    }
    const next = Number(rawValue);
    if (props.onValueChange && !isNaN(next)) {
      props.onValueChange(next);
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", props.className)}>
      {props.showValue ? (
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span>{props.label}</span>
          <span>{props.value}</span>
        </div>
      ) : null}
      <div
        className={cn(
          "relative flex h-5 w-full items-center",
          props.disabled && "opacity-50"
        )}
      >
        <div className="absolute inset-x-0 h-1.5 rounded-rounded-full bg-components-slider-default-color-track-background-default" />
        <div
          className="absolute left-0 h-1.5 rounded-rounded-full bg-components-slider-default-color-bar-background-default"
          style={barStyle()}
        />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-rounded-full border border-components-slider-default-color-thumb-border-default bg-components-slider-default-color-thumb-background-default shadow-sm"
          aria-hidden="true"
          style={thumbStyle()}
        />
        <input
          type="range"
          className="absolute inset-0 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          disabled={props.disabled}
          aria-label={props.label}
          aria-valuemin={props.min}
          aria-valuemax={props.max}
          aria-valuenow={props.value}
          onInput={(event) => handleInput(event.target.value)}
        />
      </div>
    </div>
  );
}

export default Slider;
