import * as React from "react";

export interface IconPlaceholderProps {
  size?: number;
  ariaLabel?: string;
  className?: string;
}

import { cn } from "./utils";

function IconPlaceholder(props: IconPlaceholderProps) {
  props = { size: 16, ariaLabel: "Placeholder icon", className: "", ...props };
  function dimensionStyle() {
    return {
      width: props.size + "px",
      height: props.size + "px",
    };
  }

  return (
    <span
      role="img"
      aria-label={props.ariaLabel}
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        props.className
      )}
      style={dimensionStyle()}
    >
      <svg
        className="h-full w-full text-foreground-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 17 17 7" stroke-linecap="round" />
      </svg>
    </span>
  );
}

export default IconPlaceholder;
