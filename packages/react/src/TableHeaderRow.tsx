import * as React from "react";

/* @composition {"root":"TableHeaderRow","part":"TableHeaderRow","parts":["TableHeaderRow","TableHeaderCell"],"slot":"replace"} */
export interface TableHeaderRowProps {
  children?: any;
  className?: string;
}

function TableHeaderRow(props: TableHeaderRowProps) {
  return (
    <tr className={"" + (props.className ? " " + props.className : "")}>
      {props.children}
    </tr>
  );
}

export default TableHeaderRow;
