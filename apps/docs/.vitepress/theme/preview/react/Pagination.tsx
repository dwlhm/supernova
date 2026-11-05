"use client";
import * as React from "react";

export interface PaginationEntry {
  key: string;
  label: string;
  page: number;
  isCurrent: boolean;
  isEllipsis: boolean;
}
export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
  onPageChange?: (page: number) => void;
}

import {
  cn,
  getPaginationState,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function Pagination(props: PaginationProps) {
  props = {
    currentPage: 1,
    totalPages: 1,
    previousLabel: "Previous",
    nextLabel: "Next",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <nav
      aria-label="Pagination"
      data-ctrl={typeof bindControllerProps}
      className={cn("flex items-center gap-1", props.className)}
    >
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={
          !getPaginationState(props.currentPage, props.totalPages).canPrev
        }
        aria-label={props.previousLabel}
        onClick={(event) =>
          getPaginationState(props.currentPage, props.totalPages).canPrev &&
          props.onPageChange &&
          props.onPageChange(
            getPaginationState(props.currentPage, props.totalPages).current - 1
          )
        }
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={ICON_PATHS.chevronLeft}
          />
        </svg>
        <span className="hidden sm:inline">{props.previousLabel}</span>
      </button>
      <ol className="flex items-center gap-1">
        {getPaginationState(props.currentPage, props.totalPages).entries?.map(
          (entry) => (
            <li key={entry.key}>
              {entry.isEllipsis ? (
                <span
                  className="inline-flex h-9 w-9 items-center justify-center text-sm text-foreground-default"
                  aria-hidden="true"
                >
                  {entry.label}
                </span>
              ) : null}
              {!entry.isEllipsis ? (
                <button
                  type="button"
                  aria-current={entry.isCurrent ? "page" : undefined}
                  aria-label={"Page " + entry.label}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
                    entry.isCurrent
                      ? "border-border-default bg-background-default text-foreground-default shadow-xs"
                      : "border-transparent bg-transparent text-foreground-default hover:bg-background-muted"
                  )}
                  onClick={(event) =>
                    !entry.isCurrent &&
                    props.onPageChange &&
                    props.onPageChange(entry.page)
                  }
                >
                  {entry.label}
                </button>
              ) : null}
            </li>
          )
        )}
      </ol>
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={
          !getPaginationState(props.currentPage, props.totalPages).canNext
        }
        aria-label={props.nextLabel}
        onClick={(event) =>
          getPaginationState(props.currentPage, props.totalPages).canNext &&
          props.onPageChange &&
          props.onPageChange(
            getPaginationState(props.currentPage, props.totalPages).current + 1
          )
        }
      >
        <span className="hidden sm:inline">{props.nextLabel}</span>
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={ICON_PATHS.chevronRight}
          />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
