import * as React from "react";

export interface ToggleGroupProps {
  size?: "small" | "medium" | "large";
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, bindControllerProps } from "./utils";

function ToggleGroup(props: ToggleGroupProps) {
  props = {
    size: "medium",
    ariaLabel: "Toggle group",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      role="group"
      data-ctrl={typeof bindControllerProps}
      data-size={props.size}
      aria-label={props.ariaLabel}
      className={cn(
        "inline-flex flex-row justify-start items-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm",
        cva(
          props.size,
          {
            small: "min-h-5",
            medium: "min-h-6",
            large: "min-h-9",
          },
          "medium"
        ),
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export default ToggleGroup;
