import * as React from "react";

export interface TableProps {
  caption?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function Table(props: TableProps) {
  props = { caption: "Data table", className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-border-default bg-background-default",
        props.className
      )}
    >
      <table className="w-full border-collapse">
        {props.caption ? (
          <caption className="sr-only">{props.caption}</caption>
        ) : null}
        {props.children}
      </table>
    </div>
  );
}

export default Table;
