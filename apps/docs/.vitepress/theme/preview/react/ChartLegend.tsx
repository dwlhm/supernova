import * as React from "react";

export interface ChartLegendItem {
  label: string;
  colorClass: string;
}
export interface ChartLegendProps {
  items?: ChartLegendItem[];
  className?: string;
}

import { cn, bindControllerProps } from "./utils";

function ChartLegend(props: ChartLegendProps) {
  props = { items: [], className: "", ...props };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <ul
      data-ctrl={typeof bindControllerProps}
      className={cn("flex flex-wrap items-center gap-4", props.className)}
    >
      {props.items?.map((item) => (
        <li className="flex items-center gap-2" key={item.label}>
          <span
            aria-hidden="true"
            className={cn("h-2 w-2 shrink-0 rounded-full", item.colorClass)}
          />
          <span className="text-xs text-foreground-muted">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default ChartLegend;
