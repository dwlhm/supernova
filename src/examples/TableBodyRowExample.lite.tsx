import { useStore } from '@builder.io/mitosis';
import TableBodyRow from '../components/TableBodyRow.lite';
import TableBodyCell from '../components/TableBodyCell.lite';
import TableCheckboxBodyCell from '../components/TableCheckboxBodyCell.lite';

export default function TableBodyRowExample() {
  const state = useStore({
    row1Selected: false,
    row2Selected: true,
  });

  return (
    <table class="w-full border-collapse">
      <tbody>
        <TableBodyRow selected={state.row1Selected}>
          <TableCheckboxBodyCell checked={state.row1Selected} onCheckedChange={(checked) => { state.row1Selected = checked; }} />
          <TableBodyCell>INV-2025-001</TableBodyCell>
          <TableBodyCell>Komship Express</TableBodyCell>
          <TableBodyCell>Paid</TableBodyCell>
          <TableBodyCell align="right">Rp 450.000</TableBodyCell>
        </TableBodyRow>
        <TableBodyRow selected={state.row2Selected}>
          <TableCheckboxBodyCell checked={state.row2Selected} onCheckedChange={(checked) => { state.row2Selected = checked; }} />
          <TableBodyCell>INV-2025-002</TableBodyCell>
          <TableBodyCell>Kompack Fulfillment</TableBodyCell>
          <TableBodyCell>Pending</TableBodyCell>
          <TableBodyCell align="right">Rp 1.200.000</TableBodyCell>
        </TableBodyRow>
      </tbody>
    </table>
  );
}
