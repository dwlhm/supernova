export type TableViewMode = 'orders' | 'virtual';

export interface TableSnippetOptions {
  viewMode: TableViewMode;
  activeStatus: string;
  minHighValue: number;
  pageSize: number;
}

function buildImportsAndController(opts: TableSnippetOptions): string {
  const filterInit = opts.activeStatus !== 'all' ? `{ status: '${opts.activeStatus}' }` : '{}';
  return `import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar, Badge, Button, InputText, Pagination, Table, TableBodyCell, TableBodyRow,
  TableCellValue, TableCheckboxBodyCell, TableCheckboxHeaderCell, TableEmpty,
  TableHeaderCell, TableHeaderRow, TableNoBodyCell, TableNoHeaderCell,
  createOverlayController, createTableController, filterByCriteria, getVirtualWindow, retainValidIds,
} from '@komerce-design/react';

export function OperationsOrderTable({ initialOrders }: { initialOrders: OrderRow[] }) {
  const [, setTick] = useState(0);
  const minAmountRef = useRef(${opts.minHighValue});
  const overlay = useMemo(() => createOverlayController({ defaultPlacement: 'top-right' }), []);

  const table = useMemo(() => createTableController<OrderRow>({
    rows: initialOrders,
    searchKeys: ['id', 'customer', 'email', 'courier', 'status'],
    initialPageSize: ${opts.pageSize},
    initialFilters: ${filterInit},
    filterFn: (row) => row.amount >= minAmountRef.current,
  }), [initialOrders]);

  useEffect(() => table.subscribe(() => setTick((t) => t + 1)), [table]);
  const state = table.getState();`;
}

function buildBulkActionsBlock(): string {
  return `
  const handleMarkDelivered = () => {
    const picked = new Set(state.selectedIds);
    void overlay.promise(
      new Promise<number>((resolve) => setTimeout(() => {
        table.setRows(state.allRows.map((r) => picked.has(r.id) ? { ...r, status: 'Delivered', badgeStatus: 'success' } : r));
        resolve(picked.size);
      }, 420)),
      { loading: 'Memperbarui status pengiriman...', success: (n) => \`\${n} order ditandai Delivered\` },
    );
  };

  const handleDeleteSelected = async () => {
    const ok = await overlay.confirm({
      heading: \`Hapus \${state.selectedIds.length} Order Terpilih?\`,
      description: 'ID yang dihapus otomatis dibersihkan dari selectedIds oleh retainValidIds().',
      confirmLabel: 'Ya, Hapus', cancelLabel: 'Batal', destructive: true,
    });
    if (!ok) return;
    const picked = new Set(state.selectedIds);
    const remaining = state.allRows.filter((r) => !picked.has(r.id));
    const prunedSelection = retainValidIds(remaining.map((r) => r.id), state.selectedIds);
    table.setRows(remaining); // selectedIds otomatis bersih tanpa ghost selection
    console.info('Remaining valid selected IDs:', prunedSelection);
  };`;
}

function buildToolbarJsx(): string {
  return `
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <InputText id="order-search" label="Cari Order" showLeftIcon {...table.bindSearch()} />
        <div className="flex flex-wrap gap-1.5">
          {['all', 'Delivered', 'In Transit', 'Pending Pickup', 'Returned RTS'].map((st) => (
            <Button key={st} size="small" variant={(state.filters.status || 'all') === st ? 'primary' : 'outline'} onClick={() => table.setFilter('status', st)}>
              {st} ({filterByCriteria(state.allRows, st === 'all' ? undefined : { status: st }).length})
            </Button>
          ))}
          {state.selectedIds.length > 0 && (
            <>
              <Button size="small" variant="primary" onClick={handleMarkDelivered}>Tandai Delivered</Button>
              <Button size="small" variant="destructive" onClick={() => { void handleDeleteSelected(); }}>Hapus ({state.selectedIds.length})</Button>
            </>
          )}
        </div>
      </div>`;
}

function buildTableGridJsx(): string {
  return `      <Table caption="Daftar Order Pengiriman Komerce">
        <thead>
          <TableHeaderRow>
            <TableCheckboxHeaderCell {...table.bindHeaderCheckbox()} />
            <TableNoHeaderCell>No</TableNoHeaderCell>
            <TableHeaderCell {...table.bindHeaderSort('customer')}>Merchant</TableHeaderCell>
            <TableHeaderCell {...table.bindHeaderSort('status')}>Status</TableHeaderCell>
            <TableHeaderCell align="right" {...table.bindHeaderSort('amount')}>Nilai COD</TableHeaderCell>
          </TableHeaderRow>
        </thead>
        <tbody>
          {!state.isEmpty ? state.visibleRows.map((row, idx) => (
            <TableBodyRow key={row.id} {...table.bindRow(row.id)}>
              <TableCheckboxBodyCell {...table.bindRowCheckbox(row.id)} />
              <TableNoBodyCell no={(state.currentPage - 1) * state.pageSize + idx + 1} />
              <TableBodyCell><Avatar size="mini" initialsText={row.initials} /> {row.customer}</TableBodyCell>
              <TableBodyCell><TableCellValue status={row.badgeStatus}>{row.status}</TableCellValue></TableBodyCell>
              <TableBodyCell align="right"><Badge variant="outline">Rp {row.amount.toLocaleString('id-ID')}</Badge></TableBodyCell>
            </TableBodyRow>
          )) : (
            <TableEmpty colSpan={5} title="Order Tidak Ditemukan" showCTA ctaLabel="Reset Filter" onCtaClick={() => table.clearFilters()} />
          )}
        </tbody>
      </Table>
      <Pagination {...table.bindPagination()} />
    </div>
  );
}`;
}

function buildVirtualSnippetBlock(): string {
  return `// O(1) Virtualized 10.000-Row Stream dengan getVirtualWindow
export function VirtualManifestStream() {
  const [scrollTop, setScrollTop] = useState(0);
  const [rowHeight, setRowHeight] = useState<36 | 48>(48);
  const win = getVirtualWindow({ totalItems: 10_000, itemHeight: rowHeight, containerHeight: 384, scrollTop, overscan: 4 });

  return (
    <div onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} style={{ height: 384 }} className="overflow-y-auto">
      <div style={{ paddingTop: win.paddingTop, paddingBottom: win.paddingBottom }}>
        {win.virtualItems.map((item) => (
          <div key={item.index} style={{ height: item.size }}>#AWB-{100000 + item.index}</div>
        ))}
      </div>
    </div>
  );
}`;
}

export function buildTableCodeSnippet(opts: TableSnippetOptions): string {
  const tableCode = [buildImportsAndController(opts), buildBulkActionsBlock(), buildToolbarJsx(), buildTableGridJsx()].join('\n');
  const virtualCode = buildVirtualSnippetBlock();
  return opts.viewMode === 'virtual' ? `${virtualCode}\n\n${tableCode}` : `${tableCode}\n\n${virtualCode}`;
}
