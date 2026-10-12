"use client";
import * as React from "react";

export interface TableColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
}
export interface TableRowData {
  id: string;
  cells: string[];
  selected?: boolean;
}
export interface TableProps {
  columns?: TableColumn[];
  rows?: TableRowData[];
  caption?: string;
  showCheckbox?: boolean;
  showNo?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  emptyCtaLabel?: string;
  showEmptyCta?: boolean;
  showEmptyIcon?: boolean;
  showEmptyTitle?: boolean;
  className?: string;
  onRowSelect?: (rowId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onEmptyCtaClick?: () => void;
}

import { cn } from "./utils";

function Table(props: TableProps) {
  props = {
    columns: [],
    rows: [],
    caption: "Data table",
    showCheckbox: false,
    showNo: false,
    emptyTitle: "No data available",
    emptyBody:
      "There's nothing here yet. Try adding some data or adjusting your filters.",
    emptyCtaLabel: "Add data",
    showEmptyCta: true,
    showEmptyIcon: true,
    showEmptyTitle: true,
    className: "",
    ...props,
  };
  function columnSpan() {
    let span = props.columns.length;
    if (props.showNo) {
      span = span + 1;
    }
    if (props.showCheckbox) {
      span = span + 1;
    }
    return span > 0 ? span : 1;
  }

  function isEmpty() {
    return props.rows.length === 0;
  }

  function alignmentClasses(align: string) {
    if (align === "center") {
      return "text-center";
    }
    if (align === "right") {
      return "text-right";
    }
    return "text-left";
  }

  function handleRowSelect(rowId: string, checked: boolean) {
    if (props.onRowSelect) {
      props.onRowSelect(rowId, checked);
    }
  }

  function handleSelectAll(checked: boolean) {
    if (props.onSelectAll) {
      props.onSelectAll(checked);
    }
  }

  function handleEmptyCta() {
    if (props.onEmptyCtaClick) {
      props.onEmptyCtaClick();
    }
  }

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-rounded-lg border border-components-table-default-color-container-border-default bg-components-table-default-color-container-background-default",
        props.className
      )}
    >
      <table className="w-full border-collapse">
        <caption className="sr-only">{props.caption}</caption>
        <thead>
          <tr className="border-b border-components-table-default-color-divider-border-default">
            {props.showNo ? (
              <th
                scope="col"
                className="w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default"
              >
                No.
              </th>
            ) : null}
            {props.showCheckbox ? (
              <th
                scope="col"
                className="w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center"
              >
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  className="h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default align-middle checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  onChange={(event) => handleSelectAll(true)}
                />
              </th>
            ) : null}
            {props.columns?.map((column) => (
              <th
                scope="col"
                key={column.id}
                className={cn(
                  "whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default",
                  alignmentClasses(column.align)
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty() ? (
            <tr>
              <td className="px-8 py-10" colspan={columnSpan()}>
                <div className="flex flex-col items-center gap-4 text-center">
                  {props.showEmptyIcon ? (
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-rounded-full bg-components-table-empty-color-icon-container-background-default"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-7 w-7 text-components-table-empty-color-icon-stroke-default"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                      >
                        <path
                          d="M4 7h16M4 12h16M4 17h10"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>
                  ) : null}
                  <div className="flex flex-col items-center gap-2">
                    {props.showEmptyTitle ? (
                      <span className="text-base font-semibold text-components-table-empty-color-title-foreground-default">
                        {props.emptyTitle}
                      </span>
                    ) : null}
                    <span className="max-w-sm text-sm text-components-table-empty-color-body-foreground-default">
                      {props.emptyBody}
                    </span>
                  </div>
                  {props.showEmptyCta ? (
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-rounded-lg bg-components-button-primary-color-container-background-default px-4 text-sm font-medium text-components-button-primary-color-label-foreground-default transition-colors hover:bg-components-button-primary-color-container-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                      onClick={(event) => handleEmptyCta()}
                    >
                      {props.emptyCtaLabel}
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ) : null}
          {props.rows?.map((row, index) => (
            <tr
              className="bg-components-table-default-color-row-background-default transition-colors hover:bg-background-subtle"
              key={row.id}
            >
              {props.showNo ? (
                <td className="w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center text-sm text-components-table-default-color-cell-foreground-muted">
                  {index + 1}
                </td>
              ) : null}
              {props.showCheckbox ? (
                <td className="w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer appearance-none rounded-rounded-sm border border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default align-middle checked:border-components-checkbox-on-color-container-background-default checked:bg-components-checkbox-on-color-container-background-default focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                    checked={row.selected}
                    aria-label={"Select row " + (index + 1)}
                    onChange={(event) => handleRowSelect(row.id, !row.selected)}
                  />
                </td>
              ) : null}
              {row.cells?.map((cell, cellIndex) => (
                <td
                  className="border-t border-components-table-default-color-divider-border-default px-4 py-3 align-middle text-sm text-components-table-default-color-cell-foreground-default"
                  key={cellIndex}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
