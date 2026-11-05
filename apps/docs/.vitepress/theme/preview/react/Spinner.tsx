import * as React from "react";

export interface SpinnerProps {
  size?: "12" | "16" | "24" | "32";
  label?: string;
  className?: string;
}

import { cn, cva, bindControllerProps } from "./utils";

function Spinner(props: SpinnerProps) {
  props = { size: "12", label: "Loading", className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <span
      role="status"
      aria-live="polite"
      data-ctrl={typeof bindControllerProps}
      className={cn("inline-flex items-center justify-center", props.className)}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          "animate-spin text-primary-default",
          cva(
            props.size,
            {
              "12": "h-3 w-3",
              "16": "h-4 w-4",
              "24": "h-6 w-6",
              "32": "h-8 w-8",
            },
            "12"
          )
        )}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          className="opacity-25"
          strokeWidth="2"
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{props.label}</span>
    </span>
  );
}

export default Spinner;
