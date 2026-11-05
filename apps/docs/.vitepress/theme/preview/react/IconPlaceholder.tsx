import * as React from "react";

export interface IconPlaceholderProps {
  size?: number;
  ariaLabel?: string;
  className?: string;
}

import { cn, bindControllerProps } from "./utils";

function IconPlaceholder(props: IconPlaceholderProps) {
  props = { size: 12, ariaLabel: "Placeholder icon", className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <svg
      role="img"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      data-ctrl={typeof bindControllerProps}
      aria-label={props.ariaLabel}
      width={props.size}
      height={props.size}
      className={cn(
        "inline-block shrink-0 text-foreground-muted",
        props.className
      )}
    >
      <circle cx="6" cy="6" r="5" />
    </svg>
  );
}

export default IconPlaceholder;
