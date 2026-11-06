import * as React from "react";
import TableBodyRow from "./TableBodyRow";
import TableBodyCell from "./TableBodyCell";

function TableBodyRowExample(props: any) {
  return (
    <table className="w-full border-collapse">
      <tbody>
        <TableBodyRow>
          <TableBodyCell>INV-2025-001</TableBodyCell>
          <TableBodyCell>Komship Express</TableBodyCell>
          <TableBodyCell>Paid</TableBodyCell>
          <TableBodyCell align="right">Rp 450.000</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow selected>
          <TableBodyCell>INV-2025-002</TableBodyCell>
          <TableBodyCell>Kompack Fulfillment</TableBodyCell>
          <TableBodyCell>Pending</TableBodyCell>
          <TableBodyCell align="right">Rp 1.200.000</TableBodyCell>
        </TableBodyRow>
      </tbody>
    </table>
  );
}

Object.assign(TableBodyRowExample, { TableBodyRow, TableBodyCell });

export default TableBodyRowExample;
