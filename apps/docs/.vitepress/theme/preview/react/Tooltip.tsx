import * as React from "react";

export interface TooltipProps {
  text?: string;
  position?: "top" | "bottom" | "left" | "right";
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, bindControllerProps } from "./utils";

function Tooltip(props: TooltipProps) {
  props = {
    text: "Label",
    position: "top",
    id: "tooltip",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <span
      data-ctrl={typeof bindControllerProps}
      aria-describedby={props.id}
      className={cn(
        "group relative inline-flex items-center justify-center",
        props.className
      )}
    >
      {props.children ? <>{props.children}</> : null}
      {!props.children ? (
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border-default bg-background-subtle px-3 text-xs font-medium text-foreground-default"
          aria-describedby={props.id}
        >
          Hover target
        </button>
      ) : null}
      <span
        role="tooltip"
        id={props.id}
        className={cn(
          "pointer-events-none absolute z-50 max-w-xs whitespace-nowrap rounded-md bg-foreground-default px-3 py-2 text-sm font-normal text-background-default shadow-md transition-opacity",
          props.children
            ? "invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            : "visible opacity-100",
          cva(
            props.position,
            {
              bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
              left: "right-full top-1/2 mr-2 -translate-y-1/2",
              right: "left-full top-1/2 ml-2 -translate-y-1/2",
              top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
            },
            "top"
          )
        )}
      >
        {props.text}
      </span>
    </span>
  );
}

export default Tooltip;
