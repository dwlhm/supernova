import * as React from "react";

export interface TableCellValueProps {
  layout?: "row" | "stacked";
  align?: "left" | "center" | "right";
  status?: "none" | "success" | "warning" | "destructive" | "info";
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  children?: React.ReactNode;
}

import { cn, cva, bindControllerProps } from "./utils";

function TableCellValue(props: TableCellValueProps) {
  props = {
    layout: "row",
    align: "left",
    status: "none",
    imageSrc: "",
    imageAlt: "",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <span
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "flex min-w-0 text-sm text-foreground-default",
        cva(
          props.layout,
          {
            row: "flex-row items-center gap-2 font-normal",
            stacked: "flex-col items-start gap-0.5 font-medium",
          },
          "row"
        ),
        cva(
          props.align,
          {
            left: "justify-start text-left",
            center: "justify-center text-center",
            right: "justify-end text-right tabular-nums",
          },
          "left"
        ),
        props.className
      )}
    >
      {props.imageSrc !== "" ? (
        <img
          className="h-7 w-7 shrink-0 rounded-sm object-cover"
          src={props.imageSrc}
          alt={props.imageAlt}
        />
      ) : null}
      {props.status !== "none" ? (
        <span
          aria-hidden="true"
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            cva(
              props.status,
              {
                none: "hidden",
                success: "bg-success-default",
                warning: "bg-warning-default",
                destructive: "bg-destructive-default",
                info: "bg-info-default",
              },
              "none"
            )
          )}
        />
      ) : null}
      {props.children ? <>{props.children}</> : null}
    </span>
  );
}

export default TableCellValue;
