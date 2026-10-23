import * as React from "react";

export interface SpinnerProps {
  size?: "12" | "16" | "24" | "32";
  label?: string;
  className?: string;
}

import { cn } from "./utils";

function Spinner(props: SpinnerProps) {
  props = { size: "24", label: "Loading", className: "", ...props };
  function sizeClasses() {
    switch (props.size) {
      case "12":
        return "h-3 w-3";
      case "16":
        return "h-4 w-4";
      case "32":
        return "h-8 w-8";
      case "24":
      default:
        return "h-6 w-6";
    }
  }

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center justify-center", props.className)}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          "animate-spin text-components-spinner-all-color-icon-stroke-default",
          sizeClasses()
        )}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          className="opacity-25"
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span className="sr-only">{props.label}</span>
    </span>
  );
}

export default Spinner;
