import * as React from "react";

export interface CheckboxProps {
  leftLabel?: boolean;
  rightLabel?: boolean;
  state?: "off" | "on";
  State?: "off" | "on";
  size?: "Medium" | "Small" | "Large";
  Size?: "Medium" | "Small" | "Large";
  disabled?: "false" | "true";
  Disabled?: "false" | "true";
  children?: any;
  className?: string;
}

function Checkbox(props: CheckboxProps) {
  return (
    <div
      className={
        "flex flex-row gap-2 items-center " +
        (props.size === "Medium"
          ? "px-4 py-2 text-sm"
          : props.size === "Large"
          ? "px-6 py-3 text-lg"
          : "px-3 py-1.5 text-xs") +
        (props.className ? " " + props.className : "")
      }
    >
      {props.leftLabel ? (
        <p className="text-sm font-normal text-[#0a0a0a]">Label</p>
      ) : null}
      <div className="rounded-md bg-[#e55514]">
        <div>
          <div className="border border-[var(--color-white)]" />
        </div>
      </div>
      {props.rightLabel ? (
        <p className="text-sm font-normal text-[#0a0a0a]">Label</p>
      ) : null}
      {props.children}
    </div>
  );
}

export default Checkbox;
