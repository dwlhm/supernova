import { useStore } from '@builder.io/mitosis';
import TableHeaderRow from '../components/TableHeaderRow.lite';
import TableHeaderCell from '../components/TableHeaderCell.lite';

export default function TableHeaderRowExample() {
  const state = useStore({
    sortKey: 'customer',
    sortDir: 'asc' as 'asc' | 'desc' | 'none',
    toggleSort(key: string) {
      if (state.sortKey !== key) {
        state.sortKey = key;
        state.sortDir = 'asc';
      } else {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : state.sortDir === 'desc' ? 'none' : 'asc';
      }
    },
  });

  return (
    <table class="w-full border-collapse">
      <thead>
        <TableHeaderRow>
          <TableHeaderCell sortable={true} sortDirection={state.sortKey === 'id' ? state.sortDir : 'none'} onSort={() => state.toggleSort('id')}>Order ID</TableHeaderCell>
          <TableHeaderCell sortable={true} sortDirection={state.sortKey === 'customer' ? state.sortDir : 'none'} onSort={() => state.toggleSort('customer')}>Customer</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell align="right" sortable={true} sortDirection={state.sortKey === 'total' ? state.sortDir : 'none'} onSort={() => state.toggleSort('total')}>Total</TableHeaderCell>
        </TableHeaderRow>
      </thead>
    </table>
  );
}
