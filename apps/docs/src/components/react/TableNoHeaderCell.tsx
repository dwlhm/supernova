import * as React from "react";

export interface TableNoHeaderCellProps {
  label?: string;
  className?: string;
}

import { cn } from "./utils";

function TableNoHeaderCell(props: TableNoHeaderCellProps) {
  props = { label: "No.", className: "", ...props };
  return (
    <th
      scope="col"
      className={cn(
        "w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default",
        props.className
      )}
    >
      {props.label}
    </th>
  );
}

export default TableNoHeaderCell;
