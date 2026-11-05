import * as React from "react";

export interface TableBodyRowProps {
  rowId?: string;
  cells?: TableCellInput[];
  columns?: TableColItem[];
  no?: number;
  showNo?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  checkboxAriaLabel?: string;
  className?: string;
  children?: React.ReactNode;
  onSelect?: (rowId: string, checked: boolean) => void;
}

import {
  cn,
  bindControllerProps,
  getTableBodyRowCells,
  TableColItem,
  TableCellInput,
} from "./utils";
import TableNoBodyCell from "./TableNoBodyCell";
import TableCheckboxBodyCell from "./TableCheckboxBodyCell";
import TableBodyCell from "./TableBodyCell";

function TableBodyRow(props: TableBodyRowProps) {
  props = {
    rowId: "",
    cells: [],
    columns: [],
    no: 1,
    showNo: false,
    showCheckbox: false,
    checked: false,
    checkboxAriaLabel: "Select row",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <tr
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "border-b border-border-default bg-background-default transition-colors hover:bg-background-subtle",
        props.className
      )}
    >
      {props.showNo ? <TableNoBodyCell no={props.no} /> : null}
      {props.showCheckbox ? (
        <TableCheckboxBodyCell
          checked={props.checked}
          rowId={props.rowId}
          ariaLabel={props.checkboxAriaLabel}
          onCheckedChange={(rowId, checked) =>
            props.onSelect && props.onSelect(rowId, checked)
          }
        />
      ) : null}
      {props.children ? <>{props.children}</> : null}
      {!props.children ? (
        <>
          {getTableBodyRowCells(props.cells, props.columns)?.map(
            (cell, index) => (
              <TableBodyCell
                key={index}
                value={cell.value}
                secondaryValue={cell.secondaryValue}
                badgeLabel={cell.badgeLabel}
                buttonLabel={cell.buttonLabel}
                statusLabel={cell.statusLabel}
                imageSrc={cell.imageSrc}
                avatarInitials={cell.avatarInitials}
                href={cell.href}
                align={cell.align}
              />
            )
          )}
        </>
      ) : null}
    </tr>
  );
}

Object.assign(TableBodyRow, { TableNoBodyCell, TableCheckboxBodyCell, TableBodyCell });

export default TableBodyRow;
