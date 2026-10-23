import * as React from "react";

export interface TableCellValueProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  statusLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  href?: string;
  align?: "left" | "center" | "right";
  className?: string;
  children?: any;
}

import { cn } from "./utils";

function TableCellValue(props: TableCellValueProps) {
  props = {
    value: "",
    secondaryValue: "",
    badgeLabel: "",
    statusLabel: "",
    imageSrc: "",
    avatarInitials: "",
    href: "",
    align: "left",
    className: "",
    ...props,
  };
  function containerClasses() {
    switch (props.align) {
      case "center":
        return "justify-center";
      case "right":
        return "flex-row-reverse justify-start";
      case "left":
      default:
        return "justify-start";
    }
  }

  function textAlignClasses() {
    switch (props.align) {
      case "center":
        return "items-center text-center";
      case "right":
        return "items-end text-right";
      case "left":
      default:
        return "items-start text-left";
    }
  }

  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2",
        containerClasses(),
        props.className
      )}
    >
      {props.imageSrc !== "" ? (
        <img
          alt=""
          className="h-8 w-8 shrink-0 rounded-rounded-sm object-cover"
          aria-hidden="true"
          src={props.imageSrc}
        />
      ) : null}
      {props.avatarInitials !== "" ? (
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-components-avatar-all-color-container-background-default text-xs font-medium uppercase text-components-avatar-all-color-initials-foreground-default"
          aria-hidden="true"
        >
          {props.avatarInitials}
        </span>
      ) : null}
      <span className={cn("flex min-w-0 flex-col gap-0.5", textAlignClasses())}>
        {props.href !== "" ? (
          <a
            className="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            href={props.href}
          >
            {props.value}
          </a>
        ) : null}
        {props.href === "" && props.value !== "" ? (
          <span className="truncate text-sm text-components-table-default-color-cell-foreground-default">
            {props.value}
          </span>
        ) : null}
        {props.secondaryValue !== "" ? (
          <span className="truncate text-xs text-components-table-default-color-cell-foreground-muted">
            {props.secondaryValue}
          </span>
        ) : null}
        {props.badgeLabel !== "" ? (
          <span className="inline-flex w-fit items-center gap-1 rounded-rounded-full bg-components-badge-secondary-color-container-background-default px-2 py-0.5 text-xs font-medium leading-none text-components-badge-secondary-color-label-foreground-default">
            {props.badgeLabel}
          </span>
        ) : null}
        {props.statusLabel !== "" ? (
          <span className="inline-flex w-fit items-center gap-1 text-xs text-components-table-default-color-cell-foreground-muted">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-rounded-full bg-components-avatar-all-color-status-background-online"
              aria-hidden="true"
            />
            {props.statusLabel}
          </span>
        ) : null}
      </span>
      {props.children ? <>{props.children}</> : null}
    </span>
  );
}

export default TableCellValue;
