import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar, Badge, Button, InputText, Pagination, Table, TableBodyCell, TableBodyRow,
  TableCellValue, TableCheckboxBodyCell, TableCheckboxHeaderCell, TableEmpty,
  TableHeaderCell, TableHeaderRow, TableNoBodyCell, TableNoHeaderCell,
  createTableController, filterByCriteria, retainValidIds,
} from '@komerce-design/react';
import type { OverlayInstance } from '../OverlayHosts';
import { CodeShowcaseCard } from '../components/CodeShowcaseCard';
import { buildTableCodeSnippet, type TableViewMode } from '../snippets/tableCodeSnippet';
import { VirtualTablePanel } from './VirtualTablePanel';

export interface OrderRow {
  id: string; customer: string; email: string; initials: string;
  courier: string; status: string;
  badgeStatus: 'success' | 'warning' | 'destructive' | 'info';
  amount: number;
}

const STATUS_FILTERS = ['all', 'Delivered', 'In Transit', 'Pending Pickup', 'Returned RTS'] as const;
const INITIAL_ORDERS: OrderRow[] = [
  { id: 'ORD-901', customer: 'Budi Santoso', email: 'budi@tokomaju.id', initials: 'BS', courier: 'SiCepat BEST', status: 'Delivered', badgeStatus: 'success', amount: 1450000 },
  { id: 'ORD-902', customer: 'Siti Aminah', email: 'siti@hijabstore.id', initials: 'SA', courier: 'JNE Reguler', status: 'In Transit', badgeStatus: 'info', amount: 820000 },
  { id: 'ORD-903', customer: 'Andi Wijaya', email: 'andi@gadgetpro.id', initials: 'AW', courier: 'J&T Express', status: 'Pending Pickup', badgeStatus: 'warning', amount: 3290000 },
  { id: 'ORD-904', customer: 'Dewi Lestari', email: 'dewi@organik.id', initials: 'DL', courier: 'SAP Cargo', status: 'Returned RTS', badgeStatus: 'destructive', amount: 410000 },
  { id: 'ORD-905', customer: 'Rizky Pratama', email: 'rizky@kopinusantara.id', initials: 'RP', courier: 'SiCepat BEST', status: 'Delivered', badgeStatus: 'success', amount: 2150000 },
  { id: 'ORD-906', customer: 'Nadia Putri', email: 'nadia@fashionkita.id', initials: 'NP', courier: 'JNE Reguler', status: 'In Transit', badgeStatus: 'info', amount: 975000 },
  { id: 'ORD-907', customer: 'Hendra Gunawan', email: 'hendra@elektromart.id', initials: 'HG', courier: 'J&T Express', status: 'Delivered', badgeStatus: 'success', amount: 5400000 },
  { id: 'ORD-908', customer: 'Maya Sari', email: 'maya@skincareglow.id', initials: 'MS', courier: 'SiCepat BEST', status: 'Pending Pickup', badgeStatus: 'warning', amount: 680000 },
  { id: 'ORD-909', customer: 'Fajar Nugroho', email: 'fajar@outdoorgear.id', initials: 'FN', courier: 'SAP Cargo', status: 'In Transit', badgeStatus: 'info', amount: 1890000 },
  { id: 'ORD-910', customer: 'Larasati Kusuma', email: 'laras@batiksolo.id', initials: 'LK', courier: 'JNE Reguler', status: 'Returned RTS', badgeStatus: 'destructive', amount: 1120000 },
];

function createSimulatedOrder(seq: number): OrderRow {
  const presets = [
    { customer: 'Gilang Ramadhan', email: 'gilang@sneakerhub.id', initials: 'GR', courier: 'SiCepat BEST', amount: 1640000 },
    { customer: 'Putri Maharani', email: 'putri@aromakopi.id', initials: 'PM', courier: 'J&T Express', amount: 790000 },
    { customer: 'Dimas Saputra', email: 'dimas@teknozone.id', initials: 'DS', courier: 'JNE Reguler', amount: 2850000 },
  ];
  return { id: `ORD-${910 + seq}`, ...presets[seq % presets.length]!, status: 'Pending Pickup', badgeStatus: 'warning' };
}

function OrderTableToolbar(props: {
  allRows: OrderRow[]; activeStatus: string; minAmount: number; pageSize: number;
  searchProps: { value: string; onValueChange: (q: string) => void };
  onSelectStatus: (status: string) => void; onToggleHighValue: () => void;
  onPageSizeChange: (size: number) => void; onAddSimulated: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-default bg-background-subtle p-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full md:max-w-md flex-1">
          <InputText id="tbl-search" label="Cari Order / Merchant / Ekspedisi" placeholder="Ketik ID order, nama merchant, email, atau ekspedisi..." showHint={false} showLeftIcon {...props.searchProps} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="small" variant={props.minAmount > 0 ? 'primary' : 'outline'} onClick={props.onToggleHighValue}>
            {props.minAmount > 0 ? '✓ COD >= Rp 1.000.000' : 'Filter COD >= Rp 1.000.000'}
          </Button>
          <div className="flex items-center gap-1 rounded-lg border border-border-default bg-background-default px-2.5 py-1 text-xs text-foreground-muted">
            <span className="mr-1 font-medium">Baris:</span>
            {[4, 6, 10].map((sz) => (
              <Button key={sz} size="mini" variant={props.pageSize === sz ? 'primary' : 'ghost'} onClick={() => props.onPageSizeChange(sz)}>{String(sz)}</Button>
            ))}
          </div>
          <Button size="small" variant="secondary" onClick={props.onAddSimulated}>+ Tambah Order Simulasi</Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-border-default/70 pt-3">
        <span className="mr-1 text-xs font-medium text-foreground-muted">Status (`setFilter`):</span>
        {STATUS_FILTERS.map((st) => (
          <Button key={st} size="small" variant={props.activeStatus === st ? 'primary' : 'outline'} onClick={() => props.onSelectStatus(st)}>
            {st === 'all' ? 'Semua' : st} ({filterByCriteria(props.allRows, st === 'all' ? undefined : { status: st }).length})
          </Button>
        ))}
      </div>
    </div>
  );
}

function BulkActionBar(props: {
  selectedIds: string[]; selectedTotal: number;
  onMarkDelivered: () => void; onDeleteSelected: () => void; onClearSelection: () => void;
}) {
  if (props.selectedIds.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-default/40 bg-primary-subtle/30 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2.5 text-sm">
        <Badge variant="primary">{props.selectedIds.length} Order Dipilih</Badge>
        <span className="font-medium text-foreground-default">Total Nilai COD: <strong>Rp {props.selectedTotal.toLocaleString('id-ID')}</strong></span>
        <span className="text-xs text-foreground-muted">({props.selectedIds.join(', ')})</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="small" variant="primary" onClick={props.onMarkDelivered}>Tandai Delivered</Button>
        <Button size="small" variant="destructive" onClick={props.onDeleteSelected}>Hapus Terpilih</Button>
        <Button size="small" variant="outline" onClick={props.onClearSelection}>Batal Pilih</Button>
      </div>
    </div>
  );
}

function OrderDataTable(props: { table: ReturnType<typeof createTableController<OrderRow>>; onResetFilters: () => void }) {
  const state = props.table.getState();
  return (
    <div className="flex flex-col gap-4 w-full">
      <Table caption="Daftar Operasional Order Pengiriman Komerce" className="w-full">
        <thead>
          <TableHeaderRow>
            <TableCheckboxHeaderCell {...props.table.bindHeaderCheckbox()} /><TableNoHeaderCell>No</TableNoHeaderCell>
            <TableHeaderCell {...props.table.bindHeaderSort('customer')}>Merchant &amp; Order ID</TableHeaderCell>
            <TableHeaderCell {...props.table.bindHeaderSort('courier')}>Ekspedisi</TableHeaderCell>
            <TableHeaderCell {...props.table.bindHeaderSort('status')}>Status Pengiriman</TableHeaderCell>
            <TableHeaderCell align="right" {...props.table.bindHeaderSort('amount')}>Nilai COD</TableHeaderCell>
          </TableHeaderRow>
        </thead>
        <tbody>
          {!state.isEmpty ? state.visibleRows.map((row, idx) => (
            <TableBodyRow key={row.id} {...props.table.bindRow(row.id)}>
              <TableCheckboxBodyCell {...props.table.bindRowCheckbox(row.id)} /><TableNoBodyCell no={(state.currentPage - 1) * state.pageSize + idx + 1} />
              <TableBodyCell className="py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar size="small" type="initials" initialsText={row.initials} status="online" showStatus />
                  <TableCellValue layout="stacked" secondaryText={`${row.id} • ${row.email}`}>{row.customer}</TableCellValue>
                </div>
              </TableBodyCell>
              <TableBodyCell className="py-3.5"><Badge variant="secondary">{row.courier}</Badge></TableBodyCell>
              <TableBodyCell className="py-3.5"><TableCellValue status={row.badgeStatus}>{row.status}</TableCellValue></TableBodyCell>
              <TableBodyCell align="right" className="py-3.5 font-medium"><TableCellValue align="right">Rp {row.amount.toLocaleString('id-ID')}</TableCellValue></TableBodyCell>
            </TableBodyRow>
          )) : <TableEmpty colSpan={6} title="Order Tidak Ditemukan" description="Tidak ada order yang cocok dengan kombinasi pencarian atau filter aktif." showCTA ctaLabel="Reset Semua Filter" onCtaClick={props.onResetFilters} />}
        </tbody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs text-foreground-muted">Menampilkan <strong>{state.visibleRows.length}</strong> dari <strong>{state.totalItems}</strong> order terfilter (dataset: {state.allRows.length} order)</span>
        <Pagination {...props.table.bindPagination()} />
      </div>
    </div>
  );
}

function useOrderTableActions(
  table: ReturnType<typeof createTableController<OrderRow>>,
  overlay: OverlayInstance,
  onNotify: (type: 'default' | 'success' | 'error' | 'warning' | 'info', title: string, desc: string) => void,
  clearHighValue: () => void,
) {
  const simSeqRef = useRef(0);
  const addSimulated = () => {
    const order = createSimulatedOrder(++simSeqRef.current);
    table.setRows([order, ...table.getState().allRows]);
    onNotify('success', `Order ${order.id} Ditambahkan`, `${order.customer} (${order.courier}) masuk ke baris teratas.`);
  };
  const markDelivered = () => {
    const picked = new Set(table.getState().selectedIds);
    void overlay.promise(
      new Promise<number>((resolve) => setTimeout(() => {
        table.setRows(table.getState().allRows.map((r) => (picked.has(r.id) ? { ...r, status: 'Delivered', badgeStatus: 'success' } : r)));
        resolve(picked.size);
      }, 420)),
      { loading: 'Memperbarui manifest pengiriman...', success: (n) => `${n} order berhasil ditandai Delivered` },
    );
  };
  const deleteSelected = async () => {
    const ids = table.getState().selectedIds;
    const ok = await overlay.confirm({ heading: `Hapus ${ids.length} Order Terpilih?`, description: `Order (${ids.join(', ')}) akan dihapus dan otomatis dibersihkan dari selectedIds via retainValidIds().`, confirmLabel: 'Ya, Hapus Permanen', cancelLabel: 'Batal', destructive: true });
    if (!ok) return;
    const remaining = table.getState().allRows.filter((r) => !ids.includes(r.id));
    const survivingIds = retainValidIds(remaining.map((r) => r.id), ids);
    table.setRows(remaining);
    onNotify('warning', `${ids.length} Order Dihapus`, `retainValidIds() membersihkan seleksi otomatis (tersisa ${survivingIds.length} ghost ID).`);
  };
  const resetAll = () => { clearHighValue(); table.setRows(INITIAL_ORDERS); table.reset(); onNotify('info', 'Tabel Direset', 'Dataset, filter status, pencarian, dan seleksi kembali ke awal.'); };
  return { addSimulated, markDelivered, deleteSelected, resetAll };
}

export function HeadlessTableSection(props: {
  overlay: OverlayInstance;
  onNotify: (type: 'default' | 'success' | 'error' | 'warning' | 'info', title: string, desc: string) => void;
}) {
  const [, setTick] = useState(0);
  const [viewMode, setViewMode] = useState<TableViewMode>('orders');
  const [minAmount, setMinAmount] = useState(0);
  const minAmountRef = useRef(0);
  const table = useMemo(() => createTableController<OrderRow>({ rows: INITIAL_ORDERS, searchKeys: ['id', 'customer', 'email', 'courier', 'status'], initialPageSize: 6, initialSelectedIds: ['ORD-901', 'ORD-903'], filterFn: (row) => row.amount >= minAmountRef.current }), []);
  useEffect(() => table.subscribe(() => setTick((t) => t + 1)), [table]);

  const applyMinAmount = (val: number) => { minAmountRef.current = val; setMinAmount(val); table.setPage(1); };
  const actions = useOrderTableActions(table, props.overlay, props.onNotify, () => { minAmountRef.current = 0; setMinAmount(0); });
  const state = table.getState();
  const activeStatus = state.filters.status || 'all';
  const selectedTotal = state.allRows.filter((r) => state.selectedIds.includes(r.id)).reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      <section className="rounded-2xl border border-border-default bg-background-default p-6 shadow-xs flex flex-col gap-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-default pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="small" variant={viewMode === 'orders' ? 'primary' : 'outline'} onClick={() => setViewMode('orders')}>1. Interactive Order Table (`createTableController`)</Button>
            <Button size="small" variant={viewMode === 'virtual' ? 'primary' : 'outline'} onClick={() => setViewMode('virtual')}>2. 10.000-Row Virtualized Stream (`getVirtualWindow`)</Button>
          </div>
          <Button size="small" variant="ghost" onClick={actions.resetAll}>Reset Dataset &amp; State</Button>
        </div>
        {viewMode === 'orders' ? (
          <div className="flex flex-col gap-4 w-full">
            <OrderTableToolbar allRows={state.allRows} activeStatus={activeStatus} minAmount={minAmount} pageSize={state.pageSize} searchProps={table.bindSearch()} onSelectStatus={(st) => table.setFilter('status', st)} onToggleHighValue={() => applyMinAmount(minAmount > 0 ? 0 : 1000000)} onPageSizeChange={(sz) => table.setPageSize(sz)} onAddSimulated={actions.addSimulated} />
            <BulkActionBar selectedIds={state.selectedIds} selectedTotal={selectedTotal} onMarkDelivered={actions.markDelivered} onDeleteSelected={() => { void actions.deleteSelected(); }} onClearSelection={() => table.clearSelection()} />
            <OrderDataTable table={table} onResetFilters={() => { applyMinAmount(0); table.clearFilters(); table.setQuery(''); }} />
          </div>
        ) : <VirtualTablePanel />}
      </section>
      <CodeShowcaseCard title="Composable Headless Table & Virtual Stream" description="Kombinasi penuh createTableController, filterByCriteria, retainValidIds, AlertDialog confirm, dan getVirtualWindow." helpers={['createTableController()', 'setFilter()', 'setRows()', 'retainValidIds()', 'filterByCriteria()', 'overlay.confirm()', 'getVirtualWindow()']} code={buildTableCodeSnippet({ viewMode, activeStatus, minHighValue: minAmount, pageSize: state.pageSize })} />
    </div>
  );
}
