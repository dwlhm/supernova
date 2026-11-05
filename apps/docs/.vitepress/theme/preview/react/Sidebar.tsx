import * as React from "react";

export interface SidebarProps {
  expanded?: boolean;
  brand?: string;
  accountLabel?: string;
  accountMeta?: string;
  accountInitials?: string;
  brandInitials?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function Sidebar(props: SidebarProps) {
  props = {
    expanded: false,
    brand: "Komerce",
    accountLabel: "Lionel Messi",
    accountMeta: "messi@gmail.com",
    accountInitials: "LM",
    brandInitials: "K",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <aside
      data-ctrl={typeof bindControllerProps}
      aria-label={props.brand}
      className={cn(
        "flex h-full shrink-0 flex-col justify-between border-r border-border-default bg-background-default pb-2",
        props.expanded ? "w-60" : "w-16",
        props.className
      )}
    >
      <div className="flex flex-col">
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-4",
            props.expanded ? "" : "justify-center"
          )}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-default text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {props.brandInitials}
          </span>
          {props.expanded ? (
            <span className="truncate text-sm font-semibold text-foreground-default">
              {props.brand}
            </span>
          ) : null}
        </div>
        <nav aria-label="Main" className="flex flex-col gap-2 px-2">
          {props.children}
        </nav>
      </div>
      {props.accountLabel !== "" || props.accountMeta !== "" ? (
        <div
          className={cn("px-2", props.expanded ? "" : "flex justify-center")}
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl bg-background-muted px-2 py-2",
              props.expanded ? "" : "justify-center"
            )}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-subtle text-xs font-medium text-foreground-muted"
              aria-hidden="true"
            >
              {props.accountInitials}
            </span>
            {props.expanded ? (
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-foreground-default">
                  {props.accountLabel}
                </span>
                <span className="truncate text-xs text-foreground-muted">
                  {props.accountMeta}
                </span>
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export default Sidebar;
