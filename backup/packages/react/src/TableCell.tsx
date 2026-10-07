import * as React from "react";

/* @composition {"root":"TableBodyRow","part":"TableCell","parts":["TableBodyRow","TableCell"],"slot":"replace"} */
export interface TableCellProps {
  children?: any;
  className?: string;
}

function TableCell(props: TableCellProps) {
  return (
    <td className={"" + (props.className ? " " + props.className : "")}>
      {props.children}
    </td>
  );
}

export default TableCell;
