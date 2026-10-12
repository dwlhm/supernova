"use client";
import * as React from "react";

export interface MenuItemProps {
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

function MenuItem(props: MenuItemProps) {
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
    if (props.active) {
      return "bg-components-menu-item-active-color-container-background-active-rebind";
    }
    return "hover:bg-components-menu-item-hover-color-container-background-hover-rebind";
  }

  function labelClasses() {
    return props.active
      ? "text-components-menu-item-active-color-label-foreground-active-rebind"
      : "text-components-menu-item-default-color-label-foreground-default-rebind";
  }

  function iconClasses() {
    return props.active
      ? "text-components-menu-item-active-color-icon-foreground-active-rebind"
      : "text-components-menu-item-default-color-icon-foreground-default-rebind";
  }

  function badgeClasses() {
    return props.active
      ? "bg-components-menu-item-active-color-badge-background-active-rebind text-components-menu-item-active-color-badge-label-foreground-active-rebind"
      : "bg-components-menu-item-default-color-badge-background-default-rebind text-components-menu-item-default-color-badge-label-foreground-default-rebind";
  }

  function submenuBorderClasses() {
    return props.active
      ? "border-components-menu-item-active-color-submenu-content-border-active-rebind"
      : "border-border-default";
  }

  function handleClick() {
    if (props.onClick) {
      props.onClick();
    }
  }

  return (
    <div className={cn("flex w-full flex-col", props.className)}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
          containerClasses()
        )}
        onClick={(event) => handleClick()}
      >
        {props.showLeadingIcon ? (
          <span className={cn("flex shrink-0 items-center", iconClasses())}>
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
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
      {props.children ? (
        <div
          className={cn(
            "ml-4 flex flex-col gap-1 border-l py-1 pl-2",
            submenuBorderClasses()
          )}
        >
          {props.children}
        </div>
      ) : null}
    </div>
  );
}

export default MenuItem;
