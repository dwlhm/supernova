"use client";
import * as React from "react";

export interface TopbarProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  showSidebarToggle?: boolean;
  sidebarToggleLabel?: string;
  breadcrumbRoot?: string;
  breadcrumbCurrent?: string;
  className?: string;
  children?: React.ReactNode;
  onSearchChange?: (value: string) => void;
  onToggleSidebar?: () => void;
}

import { cn, ICON_PATHS, bindControllerProps } from "./utils";

function Topbar(props: TopbarProps) {
  props = {
    showSearch: false,
    searchPlaceholder: "Search",
    searchValue: "",
    showSidebarToggle: true,
    sidebarToggleLabel: "Toggle sidebar",
    breadcrumbRoot: "Home",
    breadcrumbCurrent: "Breadcrumb",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <header
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex h-16 w-full items-center gap-2 border-b border-border-default bg-background-default px-6",
        props.className
      )}
    >
      {props.showSidebarToggle ? (
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md p-2 text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          aria-label={props.sidebarToggleLabel}
          onClick={(event) => props.onToggleSidebar && props.onToggleSidebar()}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm"
      >
        <span className="text-foreground-muted">{props.breadcrumbRoot}</span>
        <span aria-hidden="true" className="text-foreground-muted">
          /
        </span>
        <span
          aria-current="page"
          className="font-normal text-foreground-default"
        >
          {props.breadcrumbCurrent}
        </span>
      </nav>
      {props.showSearch ? (
        <div className="ml-4 flex h-8 w-full max-w-xs items-center gap-2 rounded-lg border border-border-default bg-background-default px-3 focus-within:ring-2 focus-within:ring-focus-ring-primary">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-foreground-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" d={ICON_PATHS.search} />
          </svg>
          <input
            type="search"
            className="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-foreground-muted"
            value={props.searchValue}
            placeholder={props.searchPlaceholder}
            aria-label={props.searchPlaceholder}
            onChange={(event) =>
              props.onSearchChange && props.onSearchChange(event.target.value)
            }
          />
        </div>
      ) : null}
      <div className="ml-auto flex flex-1 items-center justify-end gap-2">
        {props.children}
      </div>
    </header>
  );
}

export default Topbar;
