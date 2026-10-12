"use client";
import * as React from "react";

export interface TopbarProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  showSidebarToggle?: boolean;
  sidebarToggleLabel?: string;
  className?: string;
  children?: any;
  onSearchChange?: (value: string) => void;
  onToggleSidebar?: () => void;
}

import { cn } from "./utils";

function Topbar(props: TopbarProps) {
  props = {
    showSearch: true,
    searchPlaceholder: "Search",
    searchValue: "",
    showSidebarToggle: true,
    sidebarToggleLabel: "Toggle sidebar",
    className: "",
    ...props,
  };
  function handleSearch(rawValue: string) {
    if (props.onSearchChange) {
      props.onSearchChange(rawValue);
    }
  }

  function handleToggle() {
    if (props.onToggleSidebar) {
      props.onToggleSidebar();
    }
  }

  return (
    <header
      className={cn(
        "flex w-full items-center gap-2.5 border-b border-components-topbar-all-color-container-border-default bg-components-topbar-all-color-container-background-default px-4 py-3",
        props.className
      )}
    >
      {props.showSidebarToggle ? (
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md text-components-topbar-all-color-navigation-icon-stroke-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          aria-label={props.sidebarToggleLabel}
          onClick={(event) => handleToggle()}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" stroke-linecap="round" />
          </svg>
        </button>
      ) : null}
      {props.showSearch ? (
        <div className="flex h-8 w-full max-w-sm items-center gap-2 rounded-rounded-lg border border-components-topbar-all-color-search-border-default bg-components-topbar-all-color-search-background-default px-3">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-components-topbar-all-color-search-placeholder-foreground-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" stroke-linecap="round" />
          </svg>
          <input
            type="search"
            className="w-full bg-transparent text-sm text-foreground-default outline-none placeholder:text-components-topbar-all-color-search-placeholder-foreground-default"
            value={props.searchValue}
            placeholder={props.searchPlaceholder}
            aria-label={props.searchPlaceholder}
            onInput={(event) => handleSearch(event.target.value)}
          />
        </div>
      ) : null}
      <div className="ml-auto flex items-center gap-2.5">{props.children}</div>
    </header>
  );
}

export default Topbar;
