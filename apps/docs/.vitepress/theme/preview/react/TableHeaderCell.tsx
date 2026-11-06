import * as React from "react";

export interface TableHeaderCellProps {
  align?: "left" | "center" | "right";
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function TableHeaderCell(props: TableHeaderCellProps) {
  props = { align: "left", className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <th
      scope="col"
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "px-4 py-3 text-sm font-medium text-foreground-muted",
        props.align === "center"
          ? "text-center"
          : props.align === "right"
          ? "text-right"
          : "text-left",
        props.className
      )}
    >
      {props.children}
    </th>
  );
}

export default TableHeaderCell;
