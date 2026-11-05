"use client";
import * as React from "react";

export interface TableCheckboxHeaderCellProps {
  checked?: boolean;
  indeterminate?: boolean;
  ariaLabel?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

import { cn, ICON_PATHS, bindControllerProps } from "./utils";

function TableCheckboxHeaderCell(props: TableCheckboxHeaderCellProps) {
  props = {
    checked: false,
    indeterminate: false,
    ariaLabel: "Select all rows",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <th
      scope="col"
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center",
        props.className
      )}
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          type="checkbox"
          className="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          checked={props.checked}
          aria-checked={props.indeterminate ? "mixed" : props.checked}
          aria-label={props.ariaLabel}
          onChange={(event) =>
            props.onCheckedChange && props.onCheckedChange(!props.checked)
          }
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute h-0.5 w-2 rounded-full bg-primary-foreground",
            props.indeterminate ? "opacity-100" : "opacity-0"
          )}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={cn(
            "pointer-events-none relative h-3 w-3 text-primary-foreground",
            props.checked && !props.indeterminate ? "opacity-100" : "opacity-0"
          )}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={ICON_PATHS.check}
          />
        </svg>
      </span>
    </th>
  );
}

export default TableCheckboxHeaderCell;
