import { Show, useStore } from '@builder.io/mitosis';
import Table from '../components/Table.lite';
import TableHeaderRow from '../components/TableHeaderRow.lite';
import TableHeaderCell from '../components/TableHeaderCell.lite';
import TableBodyRow from '../components/TableBodyRow.lite';
import TableBodyCell from '../components/TableBodyCell.lite';
import TableCellValue from '../components/TableCellValue.lite';
import TableCheckboxHeaderCell from '../components/TableCheckboxHeaderCell.lite';
import TableCheckboxBodyCell from '../components/TableCheckboxBodyCell.lite';
import TableNoHeaderCell from '../components/TableNoHeaderCell.lite';
import TableNoBodyCell from '../components/TableNoBodyCell.lite';
import TableEmpty from '../components/TableEmpty.lite';

export default function TableExample() {
  const state = useStore({
    row1: false,
    row2: true,
    showEmpty: false,
    sortDir: 'none' as 'asc' | 'desc' | 'none',
    toggleAll(checked: boolean) { state.row1 = checked; state.row2 = checked; },
    updateRow1(checked: boolean) { state.row1 = checked; },
    updateRow2(checked: boolean) { state.row2 = checked; },
    cycleSort() { state.sortDir = state.sortDir === 'asc' ? 'desc' : state.sortDir === 'desc' ? 'none' : 'asc'; },
  });

  return (
    <div class="flex w-full flex-col gap-3">
      <div class="flex items-center justify-end">
        <button type="button" class="rounded-md border border-border-default bg-background-default px-2.5 py-1 text-xs font-medium text-foreground-default hover:bg-background-muted" onClick={() => { state.showEmpty = !state.showEmpty; }}>
          {state.showEmpty ? 'Show Populated Rows' : 'Preview Empty State'}
        </button>
      </div>
      <Table caption="Customer orders">
        <thead>
          <TableHeaderRow>
            <TableCheckboxHeaderCell checked={state.row1 && state.row2} indeterminate={(state.row1 || state.row2) && !(state.row1 && state.row2)} onCheckedChange={(checked) => state.toggleAll(checked)} />
            <TableNoHeaderCell />
            <TableHeaderCell sortable={true} sortDirection={state.sortDir} onSort={() => state.cycleSort()}>Customer</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell align="right">Amount</TableHeaderCell>
          </TableHeaderRow>
        </thead>
        <tbody>
          <Show when={!state.showEmpty}>
            <TableBodyRow selected={state.row1}>
              <TableCheckboxBodyCell checked={state.row1} onCheckedChange={(checked) => state.updateRow1(checked)} />
              <TableNoBodyCell no={1} />
              <TableBodyCell><TableCellValue layout="stacked" secondaryText="john@komerce.id">John Doe</TableCellValue></TableBodyCell>
              <TableBodyCell><TableCellValue status="success">Completed</TableCellValue></TableBodyCell>
              <TableBodyCell align="right"><TableCellValue align="right">$1,200.00</TableCellValue></TableBodyCell>
            </TableBodyRow>
            <TableBodyRow selected={state.row2}>
              <TableCheckboxBodyCell checked={state.row2} onCheckedChange={(checked) => state.updateRow2(checked)} />
              <TableNoBodyCell no={2} />
              <TableBodyCell><TableCellValue layout="stacked" secondaryText="jane@komerce.id">Jane Smith</TableCellValue></TableBodyCell>
              <TableBodyCell><TableCellValue status="warning">Pending</TableCellValue></TableBodyCell>
              <TableBodyCell align="right"><TableCellValue align="right">$850.00</TableCellValue></TableBodyCell>
            </TableBodyRow>
          </Show>
          <Show when={state.showEmpty}>
            <TableEmpty colSpan={5} title="No matching orders" description="Try adjusting your search or filter to find what you are looking for." showCTA={true} ctaLabel="Reset Filters" onCtaClick={() => { state.showEmpty = false; }} />
          </Show>
        </tbody>
      </Table>
    </div>
  );
}
