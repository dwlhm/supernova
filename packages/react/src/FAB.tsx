"use client";
import * as React from "react";

export interface FABProps {
  label?: string;
  variant?: "Primary" | "Secondary" | "Outline";
  size?: "Small" | "Regular" | "Large" | "Extended";
  state?: "Default" | "Hover" | "Focus" | "Disabled";
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  disabled?: boolean;
  id?: string;
  ariaDescribedby?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}

function FAB(props: FABProps) {
  return (
    <button
      type="button"
      onClick={(e) => props.onClick?.(e)}
      disabled={props.disabled || props.state === "Disabled"}
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      aria-label={props.ariaLabel}
      aria-labelledby={props.ariaLabelledby}
      className={
        "flex flex-row justify-center items-center rounded-full shadow cursor-pointer transition-colors " +
        (props.variant === "Secondary"
          ? "bg-[#f5f5f5]"
          : props.variant === "Outline"
          ? "bg-background-page"
          : "bg-[#e55514]") +
        " " +
        (props.size === "Regular"
          ? "p-4"
          : props.size === "Large"
          ? "p-8"
          : props.size === "Extended"
          ? "px-4 py-2 text-sm"
          : "p-3") +
        (props.className ? " " + props.className : "")
      }
    >
      <div>
        <div>
          <div className="border border-white" />
        </div>
      </div>
      {props.label ?? props.children ?? "Button"}
    </button>
  );
}

export default FAB;
