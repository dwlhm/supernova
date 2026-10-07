/* @composition {"root":"TableBodyRow","part":"TableBodyRow","parts":["TableBodyRow","TableCell"],"slot":"replace"} */
export interface TableBodyRowProps {
  children?: any;
  className?: string;
}

export default function TableBodyRow(props: TableBodyRowProps) {
  return (
    <tr className={"" + (props.className ? " " + props.className : "")}>{props.children}</tr>
  );
}
