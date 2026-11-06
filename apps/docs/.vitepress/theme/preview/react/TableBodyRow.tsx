import * as React from "react";

export interface TableBodyRowProps {
  selected?: boolean;
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function TableBodyRow(props: TableBodyRowProps) {
  props = { selected: false, className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <tr
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "border-b border-border-default transition-colors hover:bg-background-subtle",
        props.selected ? "bg-primary-subtle" : "bg-background-default",
        props.className
      )}
    >
      {props.children}
    </tr>
  );
}

export default TableBodyRow;
