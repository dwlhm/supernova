import * as React from "react";

export interface TableCellValueProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  buttonLabel?: string;
  statusLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  href?: string;
  align?: "left" | "center" | "right";
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, bindControllerProps } from "./utils";
import Badge from "./Badge";
import Button from "./Button";

function TableCellValue(props: TableCellValueProps) {
  props = {
    value: "Cell Value",
    secondaryValue: "",
    badgeLabel: "",
    buttonLabel: "",
    statusLabel: "",
    imageSrc: "",
    avatarInitials: "",
    href: "",
    align: "left",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <span
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex min-w-0 items-center gap-2",
        cva(
          props.align,
          {
            left: "justify-start",
            center: "justify-center",
            right: "flex-row-reverse justify-start",
          },
          "left"
        ),
        props.className
      )}
    >
      {props.imageSrc === "placeholder" ? (
        <span
          className="h-7 w-7 shrink-0 rounded bg-background-muted"
          aria-hidden="true"
        />
      ) : null}
      {props.imageSrc !== "" && props.imageSrc !== "placeholder" ? (
        <img
          alt=""
          className="h-7 w-7 shrink-0 rounded object-cover"
          aria-hidden="true"
          src={props.imageSrc}
        />
      ) : null}
      {props.avatarInitials !== "" ? (
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-muted text-xs font-medium uppercase text-foreground-subtle"
          aria-hidden="true"
        >
          {props.avatarInitials}
        </span>
      ) : null}
      {props.badgeLabel !== "" ? (
        <Badge variant="primary" label={props.badgeLabel} />
      ) : null}
      {props.buttonLabel !== "" ? (
        <Button variant="primary" size="small" label={props.buttonLabel} />
      ) : null}
      {props.badgeLabel === "" && props.buttonLabel === "" ? (
        <span
          className={cn(
            "flex min-w-0 flex-col gap-0.5",
            cva(
              props.align,
              {
                left: "items-start text-left",
                center: "items-center text-center",
                right: "items-end text-right",
              },
              "left"
            )
          )}
        >
          {props.href !== "" ? (
            <a
              className="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              href={props.href}
            >
              {props.value}
            </a>
          ) : null}
          {props.href === "" && props.value !== "" ? (
            <span className="truncate text-sm text-foreground-default">
              {props.value}
            </span>
          ) : null}
          {props.secondaryValue !== "" ? (
            <span className="truncate text-xs text-foreground-muted">
              {props.secondaryValue}
            </span>
          ) : null}
          {props.statusLabel !== "" ? (
            <span className="inline-flex w-fit items-center gap-1 text-xs text-foreground-muted">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-success-default"
                aria-hidden="true"
              />
              {props.statusLabel}
            </span>
          ) : null}
        </span>
      ) : null}
      {props.children ? <>{props.children}</> : null}
    </span>
  );
}

Object.assign(TableCellValue, { Badge, Button });

export default TableCellValue;
