import * as React from "react";

export interface TableBodyRowProps {
  rowId?: string;
  cells?: string[];
  no?: number;
  showNo?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  checkboxAriaLabel?: string;
  className?: string;
  onSelect?: (rowId: string, checked: boolean) => void;
}

import { cn } from "./utils";
import TableNoBodyCell from "./TableNoBodyCell";
import TableCheckboxBodyCell from "./TableCheckboxBodyCell";
import TableBodyCell from "./TableBodyCell";

function TableBodyRow(props: TableBodyRowProps) {
  props = {
    rowId: "",
    cells: [],
    no: 1,
    showNo: false,
    showCheckbox: false,
    checked: false,
    checkboxAriaLabel: "Select row",
    className: "",
    ...props,
  };
  function handleSelect(rowId: string, checked: boolean) {
    if (props.onSelect) {
      props.onSelect(rowId, checked);
    }
  }

  return (
    <tr
      className={cn(
        "bg-components-table-default-color-row-background-default transition-colors hover:bg-background-subtle",
        props.className
      )}
    >
      {props.showNo ? <TableNoBodyCell no={props.no} /> : null}
      {props.showCheckbox ? (
        <TableCheckboxBodyCell
          checked={props.checked}
          rowId={props.rowId}
          ariaLabel={props.checkboxAriaLabel}
          onCheckedChange={(rowId, checked) => handleSelect(rowId, checked)}
        />
      ) : null}
      {props.cells?.map((cell, index) => (
        <TableBodyCell key={index} value={cell} />
      ))}
    </tr>
  );
}

export default TableBodyRow;
