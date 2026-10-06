/* @composition {"root":"Table","part":"TableBody","parts":["Table","TableHeader","TableBody"],"slot":"replace","examples":{"static":"import { Table, TableHeader, TableBody, TableHeaderRow, TableHeaderCell, TableBodyRow, TableCell } from '@dwlhm/ui-react';\n<Table><TableHeader><TableHeaderRow><TableHeaderCell>Name</TableHeaderCell></TableHeaderRow></TableHeader><TableBody><TableBodyRow><TableCell>Product</TableCell></TableBodyRow></TableBody></Table>","loop":"import { Table, TableHeader, TableBody, TableHeaderRow, TableHeaderCell, TableBodyRow, TableCell } from '@dwlhm/ui-react';\n<Table>\n  <TableHeader><TableHeaderRow>{columns.map(column => <TableHeaderCell key={column.id}>{column.label}</TableHeaderCell>)}</TableHeaderRow></TableHeader>\n  <TableBody>{rows.map(row => <TableBodyRow key={row.id}>{columns.map(column => <TableCell key={column.id}>{row[column.id]}</TableCell>)}</TableBodyRow>)}</TableBody>\n</Table>"}} */
export interface TableBodyProps {
  children?: any;
  className?: string;
}

export default function TableBody(props: TableBodyProps) {
  return (
    <tbody className={"" + (props.className ? " " + props.className : "")}>{props.children}</tbody>
  );
}
