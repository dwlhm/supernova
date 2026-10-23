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
  onTabChange?: (id: string) => void;
}

import { cn } from "./utils";
import TabItem from "./TabItem";

function Tabs(props: TabsProps) {
  props = {
    tabs: [],
    activeTab: "",
    ariaLabel: "Tabs",
    className: "",
    ...props,
  };
  function handleTabChange(id: string) {
    if (props.onTabChange) {
      props.onTabChange(id);
    }
  }

  return (
    <div
      role="tablist"
      aria-label={props.ariaLabel}
      className={cn(
        "inline-flex h-9 items-center rounded-rounded-xl bg-components-tabs-all-color-container-background-default p-1",
        props.className
      )}
    >
      {props.tabs?.map((tab) => (
        <TabItem
          key={tab.id}
          label={tab.label}
          num={tab.num}
          active={props.activeTab === tab.id}
          showNum={tab.num !== undefined && tab.num !== ""}
          onClick={(event) => handleTabChange(tab.id)}
        />
      ))}
    </div>
  );
}

export default Tabs;
