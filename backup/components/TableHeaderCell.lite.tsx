/* @composition {"root":"TableHeaderRow","part":"TableHeaderCell","parts":["TableHeaderRow","TableHeaderCell"],"slot":"replace"} */
export interface TableHeaderCellProps {
  children?: any;
  className?: string;
}

export default function TableHeaderCell(props: TableHeaderCellProps) {
  return (
    <th scope={"col"} className={"" + (props.className ? " " + props.className : "")}>{props.children}</th>
  );
}
