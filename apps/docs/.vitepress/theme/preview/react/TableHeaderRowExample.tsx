import * as React from "react";
import TableHeaderRow from "./TableHeaderRow";
import TableHeaderCell from "./TableHeaderCell";

function TableHeaderRowExample(props: any) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <TableHeaderRow>
          <TableHeaderCell>Column 1</TableHeaderCell>
          <TableHeaderCell>Column 2</TableHeaderCell>
          <TableHeaderCell>Column 3</TableHeaderCell>
          <TableHeaderCell>Column 4</TableHeaderCell>
          <TableHeaderCell align="right">Column 5</TableHeaderCell>
        </TableHeaderRow>
      </thead>
    </table>
  );
}

Object.assign(TableHeaderRowExample, { TableHeaderRow, TableHeaderCell });

export default TableHeaderRowExample;
