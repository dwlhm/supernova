import * as React from "react";
import Table from "./Table";
import TableHeaderRow from "./TableHeaderRow";
import TableHeaderCell from "./TableHeaderCell";
import TableBodyRow from "./TableBodyRow";
import TableBodyCell from "./TableBodyCell";

function TableExample(props: any) {
  return (
    <Table caption="Recent invoices">
      <thead>
        <TableHeaderRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell align="right">Amount</TableHeaderCell>
          <TableHeaderCell>Date</TableHeaderCell>
        </TableHeaderRow>
      </thead>
      <tbody>
        <TableBodyRow>
          <TableBodyCell>John Doe</TableBodyCell>
          <TableBodyCell>Active</TableBodyCell>
          <TableBodyCell align="right">$1,200</TableBodyCell>
          <TableBodyCell>2024-01-15</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
          <TableBodyCell>Jane Smith</TableBodyCell>
          <TableBodyCell>Pending</TableBodyCell>
          <TableBodyCell align="right">$850</TableBodyCell>
          <TableBodyCell>2024-02-20</TableBodyCell>
        </TableBodyRow>
      </tbody>
    </Table>
  );
}

Object.assign(TableExample, { Table, TableHeaderRow, TableHeaderCell, TableBodyRow, TableBodyCell });

export default TableExample;
