/* @composition {"root":"TableBodyRow","part":"TableCell","parts":["TableBodyRow","TableCell"],"slot":"replace"} */
export interface TableCellProps {
  children?: any;
  className?: string;
}

export default function TableCell(props: TableCellProps) {
  return (
    <td className={"" + (props.className ? " " + props.className : "")}>{props.children}</td>
  );
}
