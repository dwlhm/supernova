import * as React from "react";

export interface ProgressbarProps {
  value?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

import { cn } from "./utils";

function Progressbar(props: ProgressbarProps) {
  props = {
    value: 0,
    label: "Progress",
    showLabel: false,
    className: "",
    ...props,
  };
  function percentage() {
    const raw = props.value;
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

  return (
    <div className={cn("flex w-full flex-col gap-2", props.className)}>
      {props.showLabel ? (
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span>{props.label}</span>
          <span>{percentage()}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        className="h-2 w-full overflow-hidden rounded-rounded-full bg-components-progressbar-all-color-track-background-default"
        aria-valuenow={percentage()}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={props.label}
      >
        <div
          className="h-2 rounded-rounded-full bg-components-progressbar-all-color-indicator-background-default transition-all"
          style={barStyle()}
        />
      </div>
    </div>
  );
}

export default Progressbar;
