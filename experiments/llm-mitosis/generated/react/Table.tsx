"use client";
import * as React from "react";

export interface TableColumn {
  key: string;
  label: string;
}
export interface TableRow {
  id: string;
  cells: Record<string, any>;
}
export interface TableProps {
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

function Table(props: TableProps) {
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
    if (typeof props.caption !== "string" || !props.caption.trim()) {
      return "Provide a descriptive table caption.";
    }
    if (!Array.isArray(props.columns) || props.columns.length === 0) {
      return "Provide at least one column.";
    }
    if (
      props.columns.some(
        (column) =>
          !column ||
          typeof column.key !== "string" ||
          !column.key.trim() ||
          typeof column.label !== "string" ||
          !column.label.trim()
      )
    ) {
      return "Every column needs a key and a label.";
    }
    if (
      new Set(props.columns.map((column) => column.key)).size !==
      props.columns.length
    ) {
      return "Column keys must be unique.";
    }
    if (!Array.isArray(props.rows)) {
      return "Rows must be an array.";
    }
    if (
      props.rows.some(
        (row) =>
          !row ||
          typeof row.id !== "string" ||
          !row.id.trim() ||
          !row.cells ||
          typeof row.cells !== "object"
      )
    ) {
      return "Every row needs a stable id and cells.";
    }
    if (new Set(props.rows.map((row) => row.id)).size !== props.rows.length) {
      return "Row ids must be unique.";
    }
    if (
      Array.isArray(props.selectedIds) &&
      props.selectedIds.some((id) => typeof id !== "string")
    ) {
      return "Selected ids must be an array of strings.";
    }
    if (props.selectable && typeof props.onSelectionChange !== "function") {
      return "Selectable tables require a selection callback.";
    }
    if (props.emptyActionLabel && typeof props.onEmptyAction !== "function") {
      return "The empty action requires a callback.";
    }
    return "";
  }

  function selectedCount() {
    if (
      invalid() ||
      !Array.isArray(props.selectedIds) ||
      !Array.isArray(props.rows)
    ) {
      return 0;
    }
    return props.rows.filter((row) => props.selectedIds.includes(row.id))
      .length;
  }

  function allSelected() {
    return (
      !invalid() &&
      Array.isArray(props.rows) &&
      props.rows.length > 0 &&
      selectedCount() === props.rows.length
    );
  }

  function partiallySelected() {
    return selectedCount() > 0 && !allSelected();
  }

  function isRowSelected(id) {
    return Array.isArray(props.selectedIds) && props.selectedIds.includes(id);
  }

  function toggleRow(id, checked) {
    if (props.disabled || invalid() || !props.onSelectionChange) return;
    const current = Array.isArray(props.selectedIds) ? props.selectedIds : [];
    props.onSelectionChange(
      checked
        ? Array.from(new Set([...current, id]))
        : current.filter((selectedId) => selectedId !== id)
    );
  }

  function toggleAll(checked) {
    if (
      props.disabled ||
      invalid() ||
      !props.onSelectionChange ||
      !Array.isArray(props.rows)
    )
      return;
    const current = Array.isArray(props.selectedIds) ? props.selectedIds : [];
    const currentIds = new Set(props.rows.map((row) => row.id));
    const otherIds = current.filter((id) => !currentIds.has(id));
    props.onSelectionChange(
      checked ? [...otherIds, ...props.rows.map((row) => row.id)] : otherIds
    );
  }

  function handleEmptyAction() {
    if (props.onEmptyAction && !props.disabled) {
      props.onEmptyAction();
    }
  }

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white font-sans">
      {Boolean(invalid()) ? (
        <p
          className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl"
          role="alert"
        >
          {invalid()}
        </p>
      ) : (
        <>
          <div>
            <div
              className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              tabindex="0"
              role="region"
              aria-label={props.caption}
            >
              <table className="w-full border-collapse text-left text-sm text-gray-700">
                <caption className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200 text-base">
                  {props.caption}
                </caption>
                <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 text-xs uppercase font-medium">
                  <tr>
                    {props.selectable ? (
                      <th scope="col" className="px-6 py-3 w-12">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                          checked={allSelected()}
                          disabled={props.disabled || props.rows.length === 0}
                          aria-label={
                            partiallySelected()
                              ? "Select all rows (some rows selected)"
                              : "Select all rows"
                          }
                          onChange={(event) => toggleAll(event.target.checked)}
                        />
                      </th>
                    ) : null}
                    {props.showRowNumbers ? (
                      <th scope="col" className="px-6 py-3 w-16 text-right">
                        No.
                      </th>
                    ) : null}
                    {props.columns?.map((column) => (
                      <th scope="col" className="px-6 py-3" key={column.key}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {props.rows?.map((row, index) => (
                    <tr
                      key={row.id}
                      data-row-id={row.id}
                      data-selected={isRowSelected(row.id) ? "true" : "false"}
                      className={
                        isRowSelected(row.id)
                          ? "bg-blue-50/70 hover:bg-blue-50"
                          : "hover:bg-gray-50 transition-colors"
                      }
                    >
                      {props.selectable ? (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                            checked={isRowSelected(row.id)}
                            disabled={props.disabled}
                            aria-label={"Select row " + row.id}
                            onChange={(event) =>
                              toggleRow(row.id, event.target.checked)
                            }
                          />
                        </td>
                      ) : null}
                      {props.showRowNumbers ? (
                        <td className="px-6 py-4 text-right tabular-nums text-gray-500 font-medium">
                          {index + 1}
                        </td>
                      ) : null}
                      {props.columns?.map((column) => (
                        <td
                          key={column.key}
                          className={
                            typeof row.cells[column.key] === "number"
                              ? "px-6 py-4 text-right tabular-nums"
                              : "px-6 py-4"
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
              <div className="py-12 px-6 text-center">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {props.emptyTitle}
                </h3>
                <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                  {props.emptyDescription}
                </p>
                {Boolean(props.emptyActionLabel) ? (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                    disabled={props.disabled}
                    onClick={(event) => handleEmptyAction()}
                  >
                    {props.emptyActionLabel}
                  </button>
                ) : null}
              </div>
            ) : null}
            {props.selectable ? (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 font-medium">
                <p role="status">
                  {selectedCount()} of {props.rows.length} rows selected
                  {partiallySelected() ? (
                    <> — partial selection</>
                  ) : (
                    <>
                      <div _text="" />
                    </>
                  )}
                </p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

export default Table;
