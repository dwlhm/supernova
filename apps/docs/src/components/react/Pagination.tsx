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

import { cn } from "./utils";

function Pagination(props: PaginationProps) {
  props = {
    currentPage: 1,
    totalPages: 1,
    previousLabel: "Previous",
    nextLabel: "Next",
    className: "",
    ...props,
  };
  function currentPageSafe() {
    const total = props.totalPages > 0 ? props.totalPages : 1;
    const current = props.currentPage;
    if (current < 1) {
      return 1;
    }
    if (current > total) {
      return total;
    }
    return current;
  }

  function canGoPrevious() {
    const total = props.totalPages > 0 ? props.totalPages : 1;
    let current = props.currentPage;
    if (current < 1) {
      current = 1;
    }
    if (current > total) {
      current = total;
    }
    return current > 1;
  }

  function canGoNext() {
    const total = props.totalPages > 0 ? props.totalPages : 1;
    let current = props.currentPage;
    if (current < 1) {
      current = 1;
    }
    if (current > total) {
      current = total;
    }
    return current < total;
  }

  function entries() {
    const total = props.totalPages > 0 ? props.totalPages : 1;
    let current = props.currentPage;
    if (current < 1) {
      current = 1;
    }
    if (current > total) {
      current = total;
    }
    const rows: PaginationEntry[] = [];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    rows.push({
      key: "page-1",
      label: "1",
      page: 1,
      isCurrent: current === 1,
      isEllipsis: false,
    });
    if (start > 2) {
      rows.push({
        key: "ellipsis-start",
        label: "...",
        page: 0,
        isCurrent: false,
        isEllipsis: true,
      });
    }
    for (let i = start; i <= end; i++) {
      rows.push({
        key: "page-" + i,
        label: String(i),
        page: i,
        isCurrent: i === current,
        isEllipsis: false,
      });
    }
    if (end < total - 1) {
      rows.push({
        key: "ellipsis-end",
        label: "...",
        page: 0,
        isCurrent: false,
        isEllipsis: true,
      });
    }
    if (total > 1) {
      rows.push({
        key: "page-" + total,
        label: String(total),
        page: total,
        isCurrent: current === total,
        isEllipsis: false,
      });
    }
    return rows;
  }

  function goTo(page: number) {
    const total = props.totalPages > 0 ? props.totalPages : 1;
    let current = props.currentPage;
    if (current < 1) {
      current = 1;
    }
    if (current > total) {
      current = total;
    }
    if (page < 1 || page > total || page === current) {
      return;
    }
    if (props.onPageChange) {
      props.onPageChange(page);
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1", props.className)}
    >
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1 rounded-rounded-lg border border-components-pagination-active-color-page-item-border-default bg-components-pagination-active-color-page-item-background-default px-3 text-sm font-medium text-components-pagination-default-color-label-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canGoPrevious()}
        aria-label={props.previousLabel}
        onClick={(event) => goTo(currentPageSafe() - 1)}
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            d="m14 6-6 6 6 6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span className="hidden sm:inline">{props.previousLabel}</span>
      </button>
      <ol className="flex items-center gap-1">
        {entries()?.map((entry) => (
          <li key={entry.key}>
            {entry.isEllipsis ? (
              <span
                className="inline-flex h-9 w-9 items-center justify-center text-sm text-components-pagination-default-color-label-foreground-default"
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
                  "inline-flex h-9 w-9 items-center justify-center rounded-rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
                  entry.isCurrent
                    ? "border-components-pagination-active-color-page-item-border-default bg-components-pagination-active-color-page-item-background-default text-components-pagination-default-color-label-foreground-default"
                    : "border-transparent bg-transparent text-components-pagination-default-color-label-foreground-default hover:bg-background-muted"
                )}
                onClick={(event) => goTo(entry.page)}
              >
                {entry.label}
              </button>
            ) : null}
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1 rounded-rounded-lg border border-components-pagination-active-color-page-item-border-default bg-components-pagination-active-color-page-item-background-default px-3 text-sm font-medium text-components-pagination-default-color-label-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canGoNext()}
        aria-label={props.nextLabel}
        onClick={(event) => goTo(currentPageSafe() + 1)}
      >
        <span className="hidden sm:inline">{props.nextLabel}</span>
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            d="m10 6 6 6-6 6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
