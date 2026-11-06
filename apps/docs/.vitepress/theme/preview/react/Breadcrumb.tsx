import * as React from "react";

export interface BreadcrumbProps {
  type?: "1" | "2" | "deep";
  showEllipsis?: boolean;
  className?: string;
  children?: React.ReactNode;
}

import { cn, bindControllerProps } from "./utils";

function Breadcrumb(props: BreadcrumbProps) {
  props = { type: "2", showEllipsis: true, className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <nav
      aria-label="Breadcrumb"
      data-ctrl={typeof bindControllerProps}
      data-type={props.type}
      data-show-ellipsis={props.showEllipsis}
      className={cn("w-full", props.className)}
    >
      <ol className="flex flex-row flex-wrap justify-start items-center gap-1.5 text-sm font-normal">
        {props.children}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
