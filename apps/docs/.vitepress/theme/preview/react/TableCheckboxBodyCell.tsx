"use client";
import * as React from "react";

export interface TableCheckboxBodyCellProps {
  checked?: boolean;
  rowId?: string;
  ariaLabel?: string;
  className?: string;
  onCheckedChange?: (rowId: string, checked: boolean) => void;
}

import { cn, ICON_PATHS, bindControllerProps } from "./utils";

function TableCheckboxBodyCell(props: TableCheckboxBodyCellProps) {
  props = {
    checked: false,
    rowId: "",
    ariaLabel: "Select row",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <td
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "w-12 whitespace-nowrap border-t border-border-default px-4 py-3 text-center",
        props.className
      )}
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          type="checkbox"
          className="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-border-default bg-background-default checked:border-primary-default checked:bg-primary-default peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
          checked={props.checked}
          aria-label={props.ariaLabel}
          onChange={(event) =>
            props.onCheckedChange &&
            props.onCheckedChange(props.rowId || "", !props.checked)
          }
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={cn(
            "pointer-events-none relative h-3 w-3 text-primary-foreground",
            props.checked ? "opacity-100" : "opacity-0"
          )}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={ICON_PATHS.check}
          />
        </svg>
      </span>
    </td>
  );
}

export default TableCheckboxBodyCell;
