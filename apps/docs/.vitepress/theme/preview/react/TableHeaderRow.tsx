import * as React from "react";

export interface TableHeaderRowProps {
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function TableHeaderRow(props: TableHeaderRowProps) {
  props = { className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <tr
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "border-b border-border-default bg-background-subtle",
        props.className
      )}
    >
      {props.children}
    </tr>
  );
}

export default TableHeaderRow;
