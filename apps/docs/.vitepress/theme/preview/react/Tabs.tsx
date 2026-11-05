"use client";
import * as React from "react";

export interface TabData {
  id: string;
  label: string;
  num?: string;
}
export interface TabsProps {
  tabs?: TabData[];
  activeTab?: string;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
  onTabChange?: (id: string) => void;
}

import { cn, handleRovingFocus, bindControllerProps } from "./utils";
import TabItem from "./TabItem";

function Tabs(props: TabsProps) {
  props = {
    tabs: [],
    activeTab: "overview",
    ariaLabel: "Tabs",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      role="tablist"
      data-ctrl={typeof bindControllerProps}
      aria-label={props.ariaLabel}
      onKeyDown={(event) =>
        handleRovingFocus(
          event,
          Math.max(
            0,
            (props.tabs || []).findIndex((t) => t.id === props.activeTab)
          ),
          (props.tabs || []).length,
          (idx) =>
            props.onTabChange &&
            (props.tabs || [])[idx] &&
            props.onTabChange((props.tabs || [])[idx].id)
        )
      }
      className={cn(
        "inline-flex h-9 items-center rounded-lg bg-background-muted p-0.5",
        props.className
      )}
    >
      {props.children ? <>{props.children}</> : null}
      {!props.children ? (
        <>
          {props.tabs?.map((tab) => (
            <TabItem
              key={tab.id}
              label={tab.label}
              num={tab.num}
              active={props.activeTab === tab.id}
              showNum={tab.num !== undefined && tab.num !== ""}
              onClick={(event) =>
                props.onTabChange && props.onTabChange(tab.id)
              }
            />
          ))}
        </>
      ) : null}
    </div>
  );
}

Object.assign(Tabs, { TabItem });

export default Tabs;
