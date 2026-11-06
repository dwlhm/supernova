"use client";
import * as React from "react";

export interface TableEmptyProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  showIcon?: boolean;
  className?: string;
  onCtaClick?: () => void;
}

import { cn, ICON_PATHS, bindControllerProps } from "./utils";

function TableEmpty(props: TableEmptyProps) {
  props = {
    title: "",
    description: "",
    ctaLabel: "",
    showIcon: true,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <div
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg bg-background-default px-8 py-10 text-center",
        props.className
      )}
    >
      {props.showIcon ? (
        <span
          className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-background-muted"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6 text-foreground-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={ICON_PATHS.search}
            />
          </svg>
        </span>
      ) : null}
      <div className="flex flex-col items-center justify-center gap-2">
        {props.title ? (
          <span className="text-center text-base font-semibold text-foreground-default">
            {props.title}
          </span>
        ) : null}
        {props.description ? (
          <span className="max-w-sm text-center text-sm font-normal text-foreground-muted">
            {props.description}
          </span>
        ) : null}
      </div>
      {props.ctaLabel ? (
        <button
          type="button"
          className="flex flex-row items-center justify-center gap-2 rounded-lg bg-secondary-default px-4 py-2 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={(event) => props.onCtaClick && props.onCtaClick()}
        >
          {props.ctaLabel}
        </button>
      ) : null}
    </div>
  );
}

export default TableEmpty;
