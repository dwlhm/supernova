"use client";
import * as React from "react";

export interface TableColumn {
  key: string;
  label: string;
}
export interface TableRow {
  id: string;
  cells: Record<string, string | number>;
}
export interface DataTableProps {
  caption: string;
  columns: TableColumn[];
  rows: TableRow[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  selectable?: boolean;
  showRowNumbers?: boolean;
  disabled?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

function DataTable(props: DataTableProps) {
  props = {
    selectedIds: [],
    selectable: false,
    showRowNumbers: false,
    disabled: false,
    emptyTitle: "No Data Available",
    emptyDescription:
      "There's nothing here yet. Try adding some data or adjusting your filters.",
    ...props,
  };
  function invalid() {
    if (typeof props.caption !== "string" || !props.caption.trim())
      return "Provide a descriptive table caption.";
    if (!Array.isArray(props.columns) || props.columns.length === 0)
      return "Provide at least one column.";
    if (
      props.columns.some(
        (column) =>
          !column ||
          typeof column.key !== "string" ||
          !column.key.trim() ||
          typeof column.label !== "string" ||
          !column.label.trim()
      )
    )
      return "Every column needs a key and a label.";
    if (
      new Set(props.columns.map((column) => column.key)).size !==
      props.columns.length
    )
      return "Column keys must be unique.";
    if (!Array.isArray(props.rows)) return "Rows must be an array.";
    if (
      props.rows.some(
        (row) =>
          !row ||
          typeof row.id !== "string" ||
          !row.id.trim() ||
          !row.cells ||
          typeof row.cells !== "object"
      )
    )
      return "Every row needs a stable id and cells.";
    if (new Set(props.rows.map((row) => row.id)).size !== props.rows.length)
      return "Row ids must be unique.";
    if (
      props.rows.some((row) =>
        props.columns.some(
          (column) =>
            !Object.prototype.hasOwnProperty.call(row.cells, column.key) ||
            (typeof row.cells[column.key] !== "string" &&
              typeof row.cells[column.key] !== "number") ||
            (typeof row.cells[column.key] === "number" &&
              !Number.isFinite(row.cells[column.key]))
        )
      )
    )
      return "Every displayed cell must contain text or a finite number.";
    if (
      !Array.isArray(props.selectedIds) ||
      props.selectedIds.some((id) => typeof id !== "string") ||
      new Set(props.selectedIds).size !== props.selectedIds.length
    )
      return "Selected ids must be an array of unique strings.";
    if (props.selectable && typeof props.onSelectionChange !== "function")
      return "Selectable tables require a selection callback.";
    if (props.emptyActionLabel && typeof props.onEmptyAction !== "function")
      return "The empty action requires a callback.";
    return "";
  }

  function selectedCount() {
    return invalid()
      ? 0
      : props.rows.filter((row) => props.selectedIds.includes(row.id)).length;
  }

  function allSelected() {
    return (
      !invalid() &&
      props.rows.length > 0 &&
      selectedCount() === props.rows.length
    );
  }

  function partiallySelected() {
    return selectedCount() > 0 && !allSelected();
  }

  function toggleRow(id: string, checked: boolean) {
    if (props.disabled || invalid() || !props.onSelectionChange) return;
    props.onSelectionChange(
      checked
        ? Array.from(new Set([...props.selectedIds, id]))
        : props.selectedIds.filter((selectedId) => selectedId !== id)
    );
  }

  function toggleAll(checked: boolean) {
    if (props.disabled || invalid() || !props.onSelectionChange) return;
    const currentIds = new Set(props.rows.map((row) => row.id));
    const otherIds = props.selectedIds.filter((id) => !currentIds.has(id));
    props.onSelectionChange(
      checked ? [...otherIds, ...props.rows.map((row) => row.id)] : otherIds
    );
  }

  return (
    <>
      <div className="lm-table">
        {invalid() ? (
          <p className="lm-table-alert" role="alert">
            {invalid()}
          </p>
        ) : (
          <>
            <div>
              <div
                className="lm-table-scroll"
                tabindex="0"
                role="region"
                aria-label={props.caption}
              >
                <table>
                  <caption>{props.caption}</caption>
                  <thead>
                    <tr>
                      {props.selectable ? (
                        <th scope="col">
                          <input
                            type="checkbox"
                            checked={allSelected()}
                            disabled={props.disabled || props.rows.length === 0}
                            aria-label={
                              partiallySelected()
                                ? "Select all rows (some rows selected)"
                                : "Select all rows"
                            }
                            onChange={(event) =>
                              toggleAll(event.target.checked)
                            }
                          />
                        </th>
                      ) : null}
                      {props.showRowNumbers ? <th scope="col">No.</th> : null}
                      {props.columns?.map((column) => (
                        <th scope="col" key={column.key}>
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {props.rows?.map((row, index) => (
                      <tr
                        key={row.id}
                        data-row-id={row.id}
                        data-selected={
                          props.selectedIds.includes(row.id) ? "true" : "false"
                        }
                      >
                        {props.selectable ? (
                          <td>
                            <input
                              type="checkbox"
                              checked={props.selectedIds.includes(row.id)}
                              disabled={props.disabled}
                              aria-label={"Select row " + row.id}
                              onChange={(event) =>
                                toggleRow(row.id, event.target.checked)
                              }
                            />
                          </td>
                        ) : null}
                        {props.showRowNumbers ? (
                          <td className="lm-table-number">{index + 1}</td>
                        ) : null}
                        {props.columns?.map((column) => (
                          <td
                            key={column.key}
                            className={
                              typeof row.cells[column.key] === "number"
                                ? "lm-table-number"
                                : ""
                            }
                          >
                            {row.cells[column.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {props.rows.length === 0 ? (
                <div className="lm-table-empty">
                  <h3>{props.emptyTitle}</h3>
                  <p>{props.emptyDescription}</p>
                  {props.emptyActionLabel ? (
                    <button
                      type="button"
                      disabled={props.disabled}
                      onClick={(event) => props.onEmptyAction()}
                    >
                      {props.emptyActionLabel}
                    </button>
                  ) : null}
                </div>
              ) : null}
              {props.selectable ? (
                <p className="lm-table-selection" role="status">
                  {selectedCount()} of {props.rows.length} rows selected
                  {partiallySelected() ? (
                    <> — partial selection</>
                  ) : (
                    <>
                      <div _text="" />
                    </>
                  )}
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .lm-table {
          font: var(--typography-body-regular);
          color: var(--color-foreground-neutral);
          border: 1px solid var(--color-border-neutral);
          border-radius: 8px;
          background: var(--color-background-page);
          overflow: hidden;
        }
        .lm-table-scroll {
          overflow-x: auto;
        }
        .lm-table table {
          border-collapse: collapse;
          width: 100%;
          text-align: left;
        }
        .lm-table caption {
          text-align: left;
          padding: 12px 16px;
          font: var(--typography-title-bold);
        }
        .lm-table th,
        .lm-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border-neutral);
          vertical-align: middle;
        }
        .lm-table th {
          font: var(--typography-body-medium);
          background: var(--color-background-neutral);
          white-space: nowrap;
        }
        .lm-table tbody tr:last-child td {
          border-bottom: 0;
        }
        .lm-table tr[data-selected="true"] {
          background: var(--color-background-primary-faded);
        }
        .lm-table .lm-table-number {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .lm-table input {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: var(--color-background-primary);
        }
        .lm-table input:focus-visible,
        .lm-table button:focus-visible,
        .lm-table-scroll:focus-visible {
          outline: 2px solid var(--color-border-focus);
          outline-offset: 2px;
        }
        .lm-table-selection {
          margin: 0;
          padding: 8px 16px;
          color: var(--color-foreground-neutral-faded);
          font: var(--typography-caption-regular);
          border-top: 1px solid var(--color-border-neutral);
        }
        .lm-table-empty {
          padding: 40px 32px;
          text-align: center;
        }
        .lm-table-empty h3 {
          font: var(--typography-title-bold);
          margin: 0 0 8px;
        }
        .lm-table-empty p {
          color: var(--color-foreground-neutral-faded);
          margin: 0 0 16px;
        }
        .lm-table-empty button {
          font: inherit;
          padding: 8px 16px;
          border: 1px solid var(--color-border-neutral);
          border-radius: 8px;
          color: var(--color-foreground-neutral);
          background: var(--color-background-neutral);
          cursor: pointer;
        }
        .lm-table-alert {
          padding: 16px;
        }
      `}</style>
    </>
  );
}

export default DataTable;
