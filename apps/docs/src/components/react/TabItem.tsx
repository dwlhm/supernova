"use client";
import * as React from "react";

export interface TabItemProps {
  label?: string;
  active?: boolean;
  showIcon?: boolean;
  showNum?: boolean;
  num?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

import { cn } from "./utils";

function TabItem(props: TabItemProps) {
  props = {
    label: "Label",
    active: false,
    showIcon: false,
    showNum: false,
    num: "1",
    className: "",
    ...props,
  };
  function tabClasses() {
    return props.active
      ? "bg-components-tabs-active-color-tab-background-default border border-components-tabs-active-color-tab-border-default shadow-sm text-components-tabs-active-color-label-foreground-default"
      : "border border-transparent text-components-tabs-inactive-color-label-foreground-default hover:bg-background-default";
  }

  function handleClick() {
    if (props.onClick) {
      props.onClick();
    }
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={props.active}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-rounded-lg px-2 py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
        tabClasses(),
        props.className
      )}
      onClick={(event) => handleClick()}
    >
      {props.showIcon ? (
        <span className="flex shrink-0 items-center text-components-tabs-all-color-icon-foreground-default">
          {props.children ? <>{props.children}</> : null}
          {!props.children ? (
            <svg
              aria-hidden="true"
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
            </svg>
          ) : null}
        </span>
      ) : null}
      <span className="truncate">{props.label}</span>
      {props.showNum ? (
        <span className="inline-flex shrink-0 items-center rounded-rounded-full bg-components-tabs-all-color-num-background-default px-1 py-0.5 text-xs font-medium leading-none text-components-tabs-all-color-num-foreground-default">
          {props.num}
        </span>
      ) : null}
    </button>
  );
}

export default TabItem;
