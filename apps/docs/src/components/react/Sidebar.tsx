import * as React from "react";

export interface SidebarProps {
  expanded?: boolean;
  brand?: string;
  accountLabel?: string;
  accountMeta?: string;
  accountInitials?: string;
  brandInitials?: string;
  className?: string;
  children?: any;
}

import { cn } from "./utils";

function Sidebar(props: SidebarProps) {
  props = {
    expanded: true,
    brand: "Komerce",
    accountLabel: "Account",
    accountMeta: "account@example.com",
    accountInitials: "AB",
    brandInitials: "K",
    className: "",
    ...props,
  };
  function widthClasses() {
    return props.expanded ? "w-60" : "w-16";
  }

  function hasAccount() {
    return props.accountLabel !== "" || props.accountMeta !== "";
  }

  return (
    <aside
      aria-label={props.brand}
      className={cn(
        "flex h-full shrink-0 flex-col justify-between border-r border-components-sidebar-expanded-rebind-color-container-border-default bg-components-sidebar-expanded-rebind-color-container-background-default pb-2",
        widthClasses(),
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md bg-components-sidebar-expanded-rebind-color-container-background-default-2 text-sm font-semibold text-components-sidebar-expanded-rebind-color-label-foreground-default-2"
            aria-hidden="true"
          >
            {props.brandInitials}
          </span>
          {props.expanded ? (
            <span className="truncate text-sm font-semibold text-components-sidebar-expanded-rebind-color-label-foreground-default">
              {props.brand}
            </span>
          ) : null}
        </div>
        <nav aria-label="Main" className="flex flex-col gap-2 px-2">
          {props.children}
        </nav>
      </div>
      {hasAccount() ? (
        <div
          className={cn("px-2", props.expanded ? "" : "flex justify-center")}
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-rounded-xl bg-background-subtle px-2 py-2",
              props.expanded ? "" : "justify-center"
            )}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-background-muted text-xs font-medium text-components-sidebar-expanded-rebind-color-section-label-foreground-default"
              aria-hidden="true"
            >
              {props.accountInitials}
            </span>
            {props.expanded ? (
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-components-sidebar-expanded-rebind-color-label-foreground-default">
                  {props.accountLabel}
                </span>
                <span className="truncate text-xs text-components-sidebar-expanded-rebind-color-section-label-foreground-default">
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
