import * as React from "react";

export interface TooltipProps {
  text?: string;
  textContent?: string;
  position?: "top" | "bottom" | "left" | "right";
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, createTooltipState, bindControllerProps } from "./utils";

function Tooltip(props: TooltipProps) {
  props = {
    text: "",
    textContent: "",
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
      aria-describedby={
        createTooltipState({
          id: props.id,
        }).getTriggerProps()["aria-describedby"]
      }
      className={cn(
        "group relative inline-flex items-center justify-center",
        props.className
      )}
    >
      {props.children ? <>{props.children}</> : null}
      <span
        role={
          createTooltipState({
            id: props.id,
          }).getContentProps().role
        }
        id={
          createTooltipState({
            id: props.id,
          }).getContentProps().id
        }
        className={cn(
          "pointer-events-none z-50 inline-flex items-center justify-center gap-0.5 whitespace-nowrap transition-opacity",
          cva(
            props.position,
            {
              top: "flex-col",
              bottom: "flex-col-reverse",
              left: "flex-row",
              right: "flex-row-reverse",
            },
            "top"
          )
        )}
      >
        <span className="inline-flex items-center justify-center rounded-lg bg-primary-default px-3 py-2 font-body text-sm font-normal leading-5 text-primary-foreground">
          {props.textContent || props.text}
        </span>
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-default"
        />
      </span>
    </span>
  );
}

export default Tooltip;
