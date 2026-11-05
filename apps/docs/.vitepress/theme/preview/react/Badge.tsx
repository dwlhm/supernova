import * as React from "react";

export interface BadgeProps {
  label?: string;
  variant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline";
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, bindControllerProps } from "./utils";

function Badge(props: BadgeProps) {
  props = { label: "Badge", variant: "primary", className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <span
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-4",
        cva(
          props.variant,
          {
            secondary: "bg-secondary-default text-secondary-foreground",
            destructive: "bg-destructive-subtle text-destructive-foreground",
            success: "bg-success-subtle text-success-foreground",
            warning: "bg-warning-subtle text-warning-foreground",
            info: "bg-info-subtle text-info-foreground",
            outline:
              "border border-border-default bg-background-default text-foreground-default",
            primary: "bg-primary-subtle text-primary-subtle-foreground",
          },
          "primary"
        ),
        props.className
      )}
    >
      {props.children ? (
        <>{props.children}</>
      ) : (
        <span className="truncate">{props.label}</span>
      )}
    </span>
  );
}

export default Badge;
