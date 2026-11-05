import * as React from "react";

export interface TableNoHeaderCellProps {
  label?: string;
  className?: string;
}

import { cn } from "./utils";

function TableNoHeaderCell(props: TableNoHeaderCellProps) {
  props = { label: "No", className: "", ...props };
  return (
    <th
      scope="col"
      className={cn(
        "w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center text-sm font-medium text-foreground-default",
        props.className
      )}
    >
      {props.label}
    </th>
  );
}

export default TableNoHeaderCell;
