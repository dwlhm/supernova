"use client";
import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
export interface BreadcrumbEntry {
  key: string;
  label: string;
  href: string;
  isEllipsis: boolean;
  isCurrent: boolean;
  originalIndex: number;
}
export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  type?: "1" | "2" | "deep";
  showEllipsis?: boolean;
  maxItems?: number;
  className?: string;
  children?: React.ReactNode;
  onNavigate?: (href: string, index: number) => void;
}

import { cn, getBreadcrumbState, bindControllerProps } from "./utils";

function Breadcrumb(props: BreadcrumbProps) {
  props = {
    items: [],
    type: "2",
    showEllipsis: true,
    maxItems: 4,
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <nav
      aria-label="Breadcrumb"
      data-ctrl={typeof bindControllerProps}
      className={cn("w-full", props.className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {props.children ? <>{props.children}</> : null}
        {!props.children ? (
          <>
            {getBreadcrumbState(props)?.map((item) => (
              <li className="flex items-center gap-1.5" key={item.key}>
                {item.isEllipsis ? (
                  <span
                    className="px-1 text-foreground-muted"
                    aria-hidden="true"
                  >
                    {item.label}
                  </span>
                ) : null}
                {!item.isEllipsis && item.isCurrent ? (
                  <span
                    aria-current="page"
                    className="font-normal text-foreground-default"
                  >
                    {item.label}
                  </span>
                ) : null}
                {!item.isEllipsis && !item.isCurrent ? (
                  <a
                    className="rounded-sm text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                    href={item.href}
                    onClick={(event) =>
                      props.onNavigate &&
                      props.onNavigate(item.href, item.originalIndex)
                    }
                  >
                    {item.label}
                  </a>
                ) : null}
                {!item.isCurrent ? (
                  <span className="text-foreground-muted" aria-hidden="true">
                    /
                  </span>
                ) : null}
              </li>
            ))}
          </>
        ) : null}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
