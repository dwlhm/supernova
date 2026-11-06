import * as React from "react";

export interface StepperProps {
  orientation?: "horizontal" | "vertical";
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function Stepper(props: StepperProps) {
  props = {
    orientation: "horizontal",
    ariaLabel: "Progress",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <nav
      data-ctrl={typeof bindControllerProps}
      aria-label={props.ariaLabel}
      className={cn("w-full bg-background-default", props.className)}
    >
      <ol
        className={cn(
          "flex items-start justify-start",
          props.orientation === "vertical" ? "flex-col" : "w-full flex-row"
        )}
      >
        {props.children}
      </ol>
    </nav>
  );
}

export default Stepper;
