import * as React from "react";

/* @composition {"root":"TableBodyRow","part":"TableBodyRow","parts":["TableBodyRow","TableCell"],"slot":"replace"} */
export interface TableBodyRowProps {
  children?: any;
  className?: string;
}

function TableBodyRow(props: TableBodyRowProps) {
  return (
    <tr className={"" + (props.className ? " " + props.className : "")}>
      {props.children}
    </tr>
  );
}

export default TableBodyRow;
