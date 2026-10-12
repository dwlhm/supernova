import * as React from "react";

export interface TableBodyCellProps {
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
import TableCellValue from "./TableCellValue";

function TableBodyCell(props: TableBodyCellProps) {
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
  function cellClasses() {
    switch (props.align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "left":
      default:
        return "text-left";
    }
  }

  return (
    <td
      className={cn(
        "border-t border-components-table-default-color-divider-border-default px-4 py-3 align-middle",
        cellClasses(),
        props.className
      )}
    >
      {props.children ? <>{props.children}</> : null}
      {!props.children ? (
        <TableCellValue
          value={props.value}
          secondaryValue={props.secondaryValue}
          badgeLabel={props.badgeLabel}
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

export default TableBodyCell;
