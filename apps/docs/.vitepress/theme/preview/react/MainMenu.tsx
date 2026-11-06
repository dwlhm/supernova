"use client";
import * as React from "react";

export interface MainMenuProps {
  active?: boolean;
  showLabel?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

import { cn, ICON_PATHS, bindControllerProps } from "./utils";

function MainMenu(props: MainMenuProps) {
  props = {
    active: false,
    showLabel: true,
    showLeadingIcon: true,
    showTrailingIcon: true,
    showBadge: false,
    badgeLabel: "",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <button
      type="button"
      data-ctrl={typeof bindControllerProps}
      aria-current={props.active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
        props.active
          ? "bg-primary-subtle hover:bg-primary-muted"
          : "hover:bg-background-muted active:bg-background-interactive",
        props.className
      )}
      onClick={(event) => props.onClick && props.onClick()}
    >
      {props.showLeadingIcon ? (
        <span
          className={cn(
            "flex shrink-0 items-center",
            props.active
              ? "text-primary-subtle-foreground"
              : "text-foreground-default"
          )}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </span>
      ) : null}
      {props.showLabel ? (
        <span
          className={cn(
            "flex-1 truncate text-left",
            props.active
              ? "text-primary-subtle-foreground"
              : "text-foreground-default"
          )}
        >
          {props.children}
        </span>
      ) : null}
      {props.showBadge ? (
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none",
            props.active
              ? "bg-primary-default text-primary-foreground"
              : "bg-primary-subtle text-primary-subtle-foreground"
          )}
        >
          {props.badgeLabel}
        </span>
      ) : null}
      {props.showTrailingIcon ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn(
            "h-4 w-4 shrink-0",
            props.active
              ? "text-primary-subtle-foreground"
              : "text-foreground-muted"
          )}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={ICON_PATHS.chevronRight}
          />
        </svg>
      ) : null}
    </button>
  );
}

export default MainMenu;
