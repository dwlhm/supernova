import * as React from "react";

export interface TableNoBodyCellProps {
  no?: number;
  className?: string;
}

import { cn } from "./utils";

function TableNoBodyCell(props: TableNoBodyCellProps) {
  props = { no: 1, className: "", ...props };
  return (
    <td
      className={cn(
        "w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center text-sm text-foreground-muted",
        props.className
      )}
    >
      {props.no}
    </td>
  );
}

export default TableNoBodyCell;
