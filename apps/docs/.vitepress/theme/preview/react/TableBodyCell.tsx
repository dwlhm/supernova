import * as React from "react";

export interface TableBodyCellProps {
  align?: "left" | "center" | "right";
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, bindControllerProps } from "./utils";

function TableBodyCell(props: TableBodyCellProps) {
  props = { align: "left", className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <td
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "border-t border-border-default px-4 py-3 align-middle text-sm font-normal text-foreground-default",
        cva(
          props.align,
          {
            left: "text-left",
            center: "text-center",
            right: "text-right",
          },
          "left"
        ),
        props.className
      )}
    >
      {props.children}
    </td>
  );
}

export default TableBodyCell;
