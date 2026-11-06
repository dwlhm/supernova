import * as React from "react";

export interface BadgeProps {
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

import { cn, cva } from "./utils";

function Badge(props: BadgeProps) {
  props = { variant: "primary", className: "", ...props };
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-4",
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
      {props.children}
    </span>
  );
}

export default Badge;
