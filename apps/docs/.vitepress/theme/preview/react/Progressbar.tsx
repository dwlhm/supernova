import * as React from "react";

export interface ProgressbarProps {
  value?: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

import { cn, getProgressState, bindControllerProps } from "./utils";

function Progressbar(props: ProgressbarProps) {
  props = {
    value: 0,
    label: "Progress",
    showLabel: false,
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
      {props.showLabel ? (
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span>{props.label}</span>
          <span>{getProgressState(props.value).percentage}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        className="h-2 w-full overflow-hidden rounded-full bg-background-muted"
        aria-valuenow={getProgressState(props.value).percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={props.label}
      >
        <div
          className="h-2 rounded-full bg-primary-default transition-all"
          style={getProgressState(props.value).barStyle}
        />
      </div>
    </div>
  );
}

export default Progressbar;
