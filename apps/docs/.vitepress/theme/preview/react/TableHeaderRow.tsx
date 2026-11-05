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
  children?: React.ReactNode;
  onSelectAll?: (checked: boolean) => void;
}

import { cn, cva, bindControllerProps } from "./utils";
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
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <tr
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "border-b border-border-default bg-background-muted",
        props.className
      )}
    >
      {props.showNo ? <TableNoHeaderCell /> : null}
      {props.showCheckbox ? (
        <TableCheckboxHeaderCell
          checked={props.allSelected}
          ariaLabel={props.checkboxAriaLabel}
          onCheckedChange={(checked) =>
            props.onSelectAll && props.onSelectAll(checked)
          }
        />
      ) : null}
      {props.children ? <>{props.children}</> : null}
      {!props.children ? (
        <>
          {props.columns?.map((column) => (
            <th
              scope="col"
              key={column.id}
              className={cn(
                "whitespace-nowrap bg-background-muted px-4 py-3 text-sm font-medium text-foreground-default",
                cva(
                  column.align,
                  {
                    left: "text-left",
                    center: "text-center",
                    right: "text-right",
                  },
                  "left"
                )
              )}
            >
              {column.label}
            </th>
          ))}
        </>
      ) : null}
    </tr>
  );
}

Object.assign(TableHeaderRow, { TableNoHeaderCell, TableCheckboxHeaderCell });

export default TableHeaderRow;
