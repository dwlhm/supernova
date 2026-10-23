"use client";
import * as React from "react";

export interface MainMenuProps {
  label?: string;
  active?: boolean;
  showLabel?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
  className?: string;
  children?: any;
  onClick?: () => void;
}

import { cn } from "./utils";

function MainMenu(props: MainMenuProps) {
  props = {
    label: "Menu",
    active: false,
    showLabel: true,
    showLeadingIcon: true,
    showTrailingIcon: true,
    showBadge: false,
    badgeLabel: "New",
    className: "",
    ...props,
  };
  function containerClasses() {
    return props.active
      ? "bg-components-main-menu-active-color-container-background-active-rebind"
      : "hover:bg-components-main-menu-all-color-container-background-hover";
  }

  function labelClasses() {
    return props.active
      ? "text-components-main-menu-active-color-label-foreground-active-rebind"
      : "text-components-main-menu-default-color-label-foreground-default-rebind";
  }

  function iconClasses() {
    return props.active
      ? "text-components-main-menu-active-color-icon-foreground-active-rebind"
      : "text-components-main-menu-default-color-icon-foreground-default-rebind";
  }

  function badgeClasses() {
    return props.active
      ? "bg-components-main-menu-active-color-badge-background-active-rebind text-components-main-menu-active-color-badge-label-foreground-active-rebind"
      : "bg-components-main-menu-default-color-badge-background-default-rebind text-components-main-menu-default-color-badge-label-foreground-default-rebind";
  }

  function handleClick() {
    if (props.onClick) {
      props.onClick();
    }
  }

  return (
    <button
      type="button"
      aria-current={props.active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-rounded-md px-2 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
        containerClasses(),
        props.className
      )}
      onClick={(event) => handleClick()}
    >
      {props.showLeadingIcon ? (
        <span className={cn("flex shrink-0 items-center", iconClasses())}>
          {props.children ? <>{props.children}</> : null}
          {!props.children ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          ) : null}
        </span>
      ) : null}
      {props.showLabel ? (
        <span className={cn("flex-1 truncate text-left", labelClasses())}>
          {props.label}
        </span>
      ) : null}
      {props.showBadge ? (
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-rounded-xl px-2 py-0.5 text-xs font-medium leading-none",
            badgeClasses()
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
          stroke-width="1.5"
          className={cn("h-4 w-4 shrink-0", iconClasses())}
        >
          <path
            d="m9 6 6 6-6 6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

export default MainMenu;
