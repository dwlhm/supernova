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
}
export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  type?: "1" | "2" | "deep";
  showEllipsis?: boolean;
  maxItems?: number;
  className?: string;
  onNavigate?: (href: string, index: number) => void;
}

import { cn } from "./utils";

function Breadcrumb(props: BreadcrumbProps) {
  props = {
    items: [],
    type: "deep",
    showEllipsis: true,
    maxItems: 4,
    className: "",
    ...props,
  };
  function visibleItems() {
    const all: BreadcrumbItem[] = props.items || [];
    const total = all.length;
    const rows: BreadcrumbEntry[] = [];
    if (total === 0) {
      return rows;
    }
    let startIndex = 0;
    const endIndex = total - 1;
    let collapsed = false;
    if (props.type === "1") {
      startIndex = total - 1;
    } else if (props.type === "2") {
      startIndex = total > 1 ? total - 2 : total - 1;
    } else {
      const limit = props.maxItems || 4;
      if (props.showEllipsis && total > limit) {
        collapsed = true;
      }
    }
    if (!collapsed) {
      for (let i = startIndex; i <= endIndex; i++) {
        rows.push({
          key: "crumb-" + i,
          label: all[i].label,
          href: all[i].href || "#",
          isEllipsis: false,
          isCurrent: i === endIndex,
        });
      }
      return rows;
    }
    rows.push({
      key: "crumb-first",
      label: all[0].label,
      href: all[0].href || "#",
      isEllipsis: false,
      isCurrent: false,
    });
    rows.push({
      key: "crumb-ellipsis",
      label: "...",
      href: "#",
      isEllipsis: true,
      isCurrent: false,
    });
    for (let i = endIndex - 1; i <= endIndex; i++) {
      rows.push({
        key: "crumb-" + i,
        label: all[i].label,
        href: all[i].href || "#",
        isEllipsis: false,
        isCurrent: i === endIndex,
      });
    }
    return rows;
  }

  function handleNavigate(href: string, index: number) {
    if (props.onNavigate && href !== "#") {
      props.onNavigate(href, index);
    }
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", props.className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {visibleItems()?.map((item, index) => (
          <li className="flex items-center gap-1.5" key={item.key}>
            {item.isEllipsis ? (
              <span
                className="px-1 text-components-breadcrumb-all-color-item-foreground-default"
                aria-hidden="true"
              >
                {item.label}
              </span>
            ) : null}
            {!item.isEllipsis && item.isCurrent ? (
              <span
                aria-current="page"
                className="font-medium text-components-breadcrumb-all-color-current-page-foreground-default"
              >
                {item.label}
              </span>
            ) : null}
            {!item.isEllipsis && !item.isCurrent ? (
              <a
                className="rounded-rounded-sm text-components-breadcrumb-all-color-item-foreground-default transition-colors hover:text-components-breadcrumb-all-color-current-page-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                href={item.href}
                onClick={(event) => handleNavigate(item.href, index)}
              >
                {item.label}
              </a>
            ) : null}
            {!item.isCurrent ? (
              <span
                className="text-components-breadcrumb-all-color-separator-stroke-default"
                aria-hidden="true"
              >
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
