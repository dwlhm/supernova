"use client";
import * as React from "react";

export interface ButtonProps {
  showLeftIcon?: boolean;
  Showlefticon?: boolean;
  showRightIcon?: boolean;
  Showrighticon?: boolean;
  leftIcon?: any;
  Lefticon?: any;
  rightIcon?: any;
  Righticon?: any;
  label?: string;
  Label?: string;
  showLabel?: boolean;
  ShowLabel?: boolean;
  roundness?: "Default" | "Round";
  Roundness?: "Default" | "Round";
  variant?: "Primary" | "Secondary" | "Outline" | "Destructive" | "Link";
  Style?: "Primary" | "Secondary" | "Outline" | "Destructive" | "Link";
  size?: "Regular" | "Large" | "Small" | "Mini";
  Size?: "Regular" | "Large" | "Small" | "Mini";
  state?: "Default" | "Focus" | "Disabled" | "Pressed";
  State?: "Default" | "Focus" | "Disabled" | "Pressed";
  onClick?: (event?: any) => void;
  children?: any;
  className?: string;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <button
      onClick={(e) => props.onClick?.(e)}
      disabled={props.disabled || props.state === "Disabled"}
      className={
        "flex flex-row gap-2 justify-center items-center rounded-lg cursor-pointer transition-colors focus:outline-none " +
        (props.variant === "Secondary"
          ? "bg-[#f5f5f5] text-[#171717]"
          : props.variant === "Outline"
          ? "bg-white border border-[#e5e5e5] text-[#0a0a0a]"
          : props.variant === "Destructive"
          ? "bg-[#dc2626] text-white"
          : props.variant === "Link"
          ? "bg-white text-[#cc4b12]"
          : "bg-[#e55514] text-white") +
        " " +
        (props.size === "Large"
          ? "px-6 py-3 text-sm"
          : props.size === "Small"
          ? "px-3 py-1 text-sm"
          : props.size === "Mini"
          ? "px-2 py-1 text-sm"
          : "px-4 py-2 text-sm") +
        (props.className ? " " + props.className : "")
      }
    >
      {props.showLeftIcon ? (
        <div className="flex flex-row justify-center items-center">
          <div>
            <div className="border-[var(--color-white)]" />
          </div>
        </div>
      ) : null}
      {props.label || props.children || "Button"}
      {props.showRightIcon ? (
        <div className="flex flex-row justify-center items-center">
          <div>
            <div className="border-[var(--color-white)]" />
          </div>
        </div>
      ) : null}
    </button>
  );
}

export default Button;
