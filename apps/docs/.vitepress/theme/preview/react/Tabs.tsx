import * as React from "react";

export interface TabsProps {
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function Tabs(props: TabsProps) {
  props = { ariaLabel: "Tabs", className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      role="tablist"
      data-ctrl={typeof bindControllerProps}
      aria-label={props.ariaLabel}
      className={cn(
        "inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export default Tabs;
