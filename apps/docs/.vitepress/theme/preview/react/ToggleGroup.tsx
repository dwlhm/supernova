import * as React from "react";

export interface ToggleGroupItem {
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
}
export interface ToggleGroupProps {
  items?: ToggleGroupItem[];
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  label?: string;
  className?: string;
  onToggle?: (id: string, checked: boolean) => void;
}

import { cn } from "./utils";
import SwitchButton from "./SwitchButton";

function ToggleGroup(props: ToggleGroupProps) {
  props = {
    items: [],
    size: "medium",
    showLabel: true,
    label: "Settings",
    className: "",
    ...props,
  };
  function handleToggle(id: string, checked: boolean) {
    if (props.onToggle) {
      props.onToggle(id, checked);
    }
  }

  return (
    <fieldset
      className={cn(
        "flex w-full flex-col rounded-rounded-lg border border-components-toggle-group-all-color-container-border-stroke-default",
        props.className
      )}
    >
      {props.showLabel ? (
        <legend className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-foreground-muted">
          {props.label}
        </legend>
      ) : null}
      {props.items?.map((item) => (
        <div
          className="flex items-center justify-between gap-4 border-t border-components-toggle-group-all-color-container-border-stroke-default px-4 py-3 first:border-t-0"
          key={item.id}
        >
          <span className="text-sm text-foreground-default">{item.label}</span>
          <SwitchButton
            checked={item.checked}
            disabled={item.disabled}
            size={props.size}
            label={item.label}
            leftLabel={false}
            rightLabel={false}
            onCheckedChange={(checked) => handleToggle(item.id, checked)}
          />
        </div>
      ))}
    </fieldset>
  );
}

export default ToggleGroup;
