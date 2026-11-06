"use client";
import * as React from "react";

export interface TabItemProps {
  active?: boolean;
  state?: "default" | "active";
  showIcon?: boolean;
  showNum?: boolean;
  num?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

import { cn, ICON_PATHS, bindControllerProps } from "./utils";

function TabItem(props: TabItemProps) {
  props = {
    active: false,
    state: "default",
    showIcon: false,
    showNum: false,
    num: "",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <button
      type="button"
      role="tab"
      data-ctrl={typeof bindControllerProps}
      aria-selected={props.active || props.state === "active"}
      tabIndex={props.active || props.state === "active" ? 0 : -1}
      className={cn(
        "inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
        props.active || props.state === "active"
          ? "border border-border-default bg-background-default text-foreground-default shadow-sm"
          : "text-foreground-muted hover:text-foreground-default",
        props.className
      )}
      onClick={(event) => props.onClick && props.onClick()}
    >
      {props.showIcon ? (
        <span className="flex shrink-0 items-center text-foreground-muted">
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" d={ICON_PATHS.menu} />
          </svg>
        </span>
      ) : null}
      <span className="truncate">{props.children}</span>
      {props.showNum ? (
        <span className="inline-flex shrink-0 items-center rounded-full bg-background-muted px-1.5 py-0.5 text-xs font-medium leading-none text-foreground-muted">
          {props.num}
        </span>
      ) : null}
    </button>
  );
}

export default TabItem;
