import * as React from "react";

export interface TableHeaderColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
}
export interface TableHeaderRowProps {
  columns?: TableHeaderColumn[];
  showCheckbox?: boolean;
  showNo?: boolean;
  allSelected?: boolean;
  checkboxAriaLabel?: string;
  className?: string;
  onSelectAll?: (checked: boolean) => void;
}

import { cn } from "./utils";
import TableNoHeaderCell from "./TableNoHeaderCell";
import TableCheckboxHeaderCell from "./TableCheckboxHeaderCell";

function TableHeaderRow(props: TableHeaderRowProps) {
  props = {
    columns: [],
    showCheckbox: false,
    showNo: false,
    allSelected: false,
    checkboxAriaLabel: "Select all rows",
    className: "",
    ...props,
  };
  function alignmentClasses(align: string) {
    if (align === "center") {
      return "text-center";
    }
    if (align === "right") {
      return "text-right";
    }
    return "text-left";
  }

  function handleSelectAll(checked: boolean) {
    if (props.onSelectAll) {
      props.onSelectAll(checked);
    }
  }

  return (
    <tr
      className={cn(
        "border-b border-components-table-default-color-divider-border-default",
        props.className
      )}
    >
      {props.showNo ? <TableNoHeaderCell /> : null}
      {props.showCheckbox ? (
        <TableCheckboxHeaderCell
          checked={props.allSelected}
          ariaLabel={props.checkboxAriaLabel}
          onCheckedChange={(checked) => handleSelectAll(checked)}
        />
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
  );
}

export default TableHeaderRow;
