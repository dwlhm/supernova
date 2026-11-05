"use client";
import * as React from "react";

export interface SliderProps {
  id?: string;
  name?: string;
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

import { cn, getSliderState, bindControllerProps } from "./utils";

function Slider(props: SliderProps) {
  props = {
    id: "slider",
    name: "slider",
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
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn("flex w-full flex-col gap-2", props.className)}
    >
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
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-background-muted" />
        <div
          className="absolute left-0 h-1.5 rounded-full bg-primary-default"
          style={getSliderState(props).barStyle}
        />
        <input
          type="range"
          className="peer absolute inset-0 z-10 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          id={props.id}
          name={props.name}
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          disabled={props.disabled}
          aria-label={props.label}
          onChange={(event) =>
            !props.disabled &&
            props.onValueChange &&
            props.onValueChange(Number(event.target.value))
          }
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          style={getSliderState(props).thumbStyle}
        />
      </div>
    </div>
  );
}

export default Slider;
