"use client";
import * as React from "react";

export interface TableColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
}
export interface TableRowData {
  id: string;
  cells: TableCellInput[];
  selected?: boolean;
}
export interface TableProps {
  state?: "default" | "empty";
  columns?: TableColumn[];
  rows?: TableRowData[];
  caption?: string;
  showCheckbox?: boolean;
  showNo?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  rowsPerPageLabel?: string;
  emptyTitle?: string;
  emptyBody?: string;
  emptyCtaLabel?: string;
  showEmptyCta?: boolean;
  showEmptyIcon?: boolean;
  showEmptyTitle?: boolean;
  showEmptyDescription?: boolean;
  className?: string;
  children?: React.ReactNode;
  onRowSelect?: (rowId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onEmptyCtaClick?: () => void;
}

import {
  cn,
  getTableState,
  ICON_PATHS,
  bindControllerProps,
  TableCellInput,
} from "./utils";
import TableHeaderRow from "./TableHeaderRow";
import TableBodyRow from "./TableBodyRow";
import Pagination from "./Pagination";

function Table(props: TableProps) {
  props = {
    state: "default",
    columns: [],
    rows: [],
    caption: "Data table",
    showCheckbox: false,
    showNo: false,
    showPagination: true,
    currentPage: 2,
    totalPages: 10,
    pageSize: 10,
    rowsPerPageLabel: "Rows per page",
    emptyTitle: "No Data Available",
    emptyBody:
      "There's nothing here yet. Try adding some data or adjusting your filters.",
    emptyCtaLabel: "Add Data",
    showEmptyCta: true,
    showEmptyIcon: true,
    showEmptyTitle: true,
    showEmptyDescription: true,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "w-full overflow-x-auto rounded-lg bg-background-default",
        getTableState(props).isEmpty && !props.children
          ? ""
          : "border border-border-default",
        props.className
      )}
    >
      {getTableState(props).isEmpty && !props.children ? (
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-10 text-center">
          {props.showEmptyIcon ? (
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full bg-background-muted"
              aria-hidden="true"
            >
              <svg
                className="h-7 w-7 text-foreground-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={ICON_PATHS.search}
                />
              </svg>
            </span>
          ) : null}
          <div className="flex flex-col items-center gap-2">
            {props.showEmptyTitle ? (
              <span className="text-base font-semibold text-foreground-default">
                {props.emptyTitle}
              </span>
            ) : null}
            {props.showEmptyDescription ? (
              <span className="max-w-sm text-sm text-foreground-muted">
                {props.emptyBody}
              </span>
            ) : null}
          </div>
          {props.showEmptyCta ? (
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-secondary-default px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              onClick={(event) =>
                props.onEmptyCtaClick && props.onEmptyCtaClick()
              }
            >
              {props.emptyCtaLabel}
            </button>
          ) : null}
        </div>
      ) : null}
      {!getTableState(props).isEmpty || Boolean(props.children) ? (
        <>
          <table className="w-full border-collapse">
            <caption className="sr-only">{props.caption}</caption>
            {props.children ? <>{props.children}</> : null}
            {!props.children ? (
              <>
                <thead>
                  <TableHeaderRow
                    columns={getTableState(props).columns}
                    showCheckbox={props.showCheckbox}
                    showNo={props.showNo}
                    allSelected={getTableState(props).allSelected}
                    onSelectAll={(checked) =>
                      props.onSelectAll && props.onSelectAll(checked)
                    }
                  />
                </thead>
                <tbody>
                  {getTableState(props).rows?.map((row, index) => (
                    <TableBodyRow
                      key={row.id}
                      rowId={row.id}
                      cells={row.cells}
                      columns={getTableState(props).columns}
                      no={index + 1}
                      showNo={props.showNo}
                      showCheckbox={props.showCheckbox}
                      checked={row.selected}
                      checkboxAriaLabel={"Select row " + (index + 1)}
                      onSelect={(rowId, checked) =>
                        props.onRowSelect && props.onRowSelect(rowId, checked)
                      }
                    />
                  ))}
                </tbody>
              </>
            ) : null}
          </table>
          {props.showPagination ? (
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="pr-2 text-sm text-foreground-default">
                  {props.rowsPerPageLabel}
                </span>
                <select
                  className="h-9 rounded-lg border border-border-default bg-background-default px-3 text-sm font-medium text-foreground-default shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                  aria-label={props.rowsPerPageLabel}
                  value={String(props.pageSize)}
                  onChange={(event) =>
                    props.onPageSizeChange &&
                    props.onPageSizeChange(Number(event.target.value))
                  }
                >
                  {getTableState(props).pageSizeOptions?.map((opt) => (
                    <option key={opt} value={String(opt)}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <Pagination
                currentPage={props.currentPage}
                totalPages={props.totalPages}
                onPageChange={(page) =>
                  props.onPageChange && props.onPageChange(page)
                }
              />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

Object.assign(Table, { HeaderRow: TableHeaderRow, TableHeaderRow, BodyRow: TableBodyRow, TableBodyRow, Pagination });

export default Table;
