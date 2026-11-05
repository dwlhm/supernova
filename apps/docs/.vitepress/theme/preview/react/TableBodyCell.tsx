import * as React from "react";

export interface TableBodyCellProps {
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
import TableCellValue from "./TableCellValue";

function TableBodyCell(props: TableBodyCellProps) {
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
    <td
      data-ctrl={typeof bindControllerProps}
      className={cn(
        "border-t border-border-default px-4 py-3 align-middle",
        cva(
          props.align,
          {
            left: "text-left",
            center: "text-center",
            right: "text-right",
          },
          "left"
        ),
        props.className
      )}
    >
      {props.children ? <>{props.children}</> : null}
      {!props.children ? (
        <TableCellValue
          value={props.value}
          secondaryValue={props.secondaryValue}
          badgeLabel={props.badgeLabel}
          buttonLabel={props.buttonLabel}
          statusLabel={props.statusLabel}
          imageSrc={props.imageSrc}
          avatarInitials={props.avatarInitials}
          href={props.href}
          align={props.align}
        />
      ) : null}
    </td>
  );
}

Object.assign(TableBodyCell, { TableCellValue });

export default TableBodyCell;
