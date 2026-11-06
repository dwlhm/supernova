"use client";
import * as React from "react";

export interface BreadcrumbItemProps {
  href?: string;
  isCurrent?: boolean;
  isEllipsis?: boolean;
  className?: string;
  children?: React.ReactNode;
  onNavigate?: (href: string) => void;
}

import { cn, bindControllerProps } from "./utils";

function BreadcrumbItem(props: BreadcrumbItemProps) {
  props = {
    href: "#",
    isCurrent: false,
    isEllipsis: false,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <li
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex flex-row justify-center items-center gap-1.5 text-sm font-normal",
        props.className
      )}
    >
      {props.isEllipsis ? (
        <span
          className="inline-flex items-center justify-center w-3.5 h-3.5 text-foreground-muted"
          aria-hidden="true"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="3" cy="7" r="1" />
            <circle cx="7" cy="7" r="1" />
            <circle cx="11" cy="7" r="1" />
          </svg>
        </span>
      ) : null}
      {!props.isEllipsis && props.isCurrent ? (
        <span
          aria-current="page"
          className="flex flex-row justify-center items-center gap-2.5 text-sm font-normal text-foreground-default"
        >
          {props.children}
        </span>
      ) : null}
      {!props.isEllipsis && !props.isCurrent ? (
        <a
          className="flex flex-row justify-center items-center gap-2.5 rounded-sm text-sm font-normal text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          href={props.href}
          onClick={(event) =>
            props.onNavigate && props.onNavigate(props.href || "#")
          }
        >
          {props.children}
        </a>
      ) : null}
      {!props.isCurrent ? (
        <span
          className="text-sm font-normal text-foreground-muted"
          aria-hidden="true"
        >
          /
        </span>
      ) : null}
    </li>
  );
}

export default BreadcrumbItem;
