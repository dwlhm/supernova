<template>
  <div class="my-2 flex flex-col gap-5 rounded-2xl border border-border-default bg-background-default p-6 text-foreground-default shadow-xs">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border-default pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-primary-default"></span>
          <h3 class="text-base font-bold tracking-tight text-foreground-default">
            Interactive Headless Table Playground (`createTableController`)
          </h3>
        </div>
        <p class="mt-1 text-xs text-foreground-muted">
          Uji langsung pencarian (`bindSearch`), tri-state sorting (`bindHeaderSort`), seleksi checkbox halaman/baris (`bindHeaderCheckbox` &amp; `bindRowCheckbox`), serta paginasi (`bindPagination`).
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" class="cursor-pointer rounded-lg border border-border-default bg-background-subtle px-2.5 py-1.5 text-xs font-medium text-foreground-default hover:bg-background-muted" @click="table.toggleAllVisible(true)">
          Pilih Halaman Ini
        </button>
        <button type="button" class="cursor-pointer rounded-lg border border-border-default bg-background-subtle px-2.5 py-1.5 text-xs font-medium text-foreground-default hover:bg-background-muted" @click="table.clearSelection()">
          Clear Selection ({{ state.selectedIds.length }})
        </button>
        <button type="button" class="cursor-pointer rounded-lg border border-border-default bg-background-subtle px-2.5 py-1.5 text-xs font-medium text-foreground-default hover:bg-background-muted" @click="table.reset()">
          Reset Table
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div class="flex flex-col gap-4 lg:col-span-8">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div class="w-full sm:max-w-xs">
            <InputText
              id="tbl-search"
              label="Cari Order / Customer"
              placeholder="Ketik nama, email, atau status..."
              :showHint="false"
              :showLeftIcon="true"
              v-bind="searchProps"
            />
          </div>
          <div class="flex items-center gap-2 text-xs text-foreground-muted">
            <span>Page Size:</span>
            <button
              v-for="sz in [3, 5, 8]"
              :key="sz"
              type="button"
              :class="[
                'cursor-pointer rounded-md border px-2 py-1 font-mono text-xs font-semibold transition-colors',
                state.pageSize === sz ? 'border-primary-default bg-primary-default text-primary-foreground' : 'border-border-default bg-background-subtle text-foreground-default hover:bg-background-muted'
              ]"
              @click="table.setPageSize(sz)"
            >
              {{ sz }}
            </button>
          </div>
        </div>

        <Table caption="Komerce Orders Table">
          <thead>
            <TableHeaderRow>
              <TableCheckboxHeaderCell v-bind="headerCheckboxProps" />
              <TableNoHeaderCell />
              <TableHeaderCell v-bind="sortCustomerProps">Customer</TableHeaderCell>
              <TableHeaderCell v-bind="sortStatusProps">Status</TableHeaderCell>
              <TableHeaderCell align="right" v-bind="sortAmountProps">Amount (IDR)</TableHeaderCell>
            </TableHeaderRow>
          </thead>
          <tbody>
            <template v-if="!state.isEmpty">
              <TableBodyRow v-for="(row, idx) in state.visibleRows" :key="row.id" v-bind="table.bindRow(row.id)">
                <TableCheckboxBodyCell v-bind="table.bindRowCheckbox(row.id)" />
                <TableNoBodyCell :no="(state.currentPage - 1) * state.pageSize + idx + 1" />
                <TableBodyCell>
                  <TableCellValue layout="stacked" :secondaryText="row.email">{{ row.customer }}</TableCellValue>
                </TableBodyCell>
                <TableBodyCell>
                  <TableCellValue :status="row.badgeStatus">{{ row.status }}</TableCellValue>
                </TableBodyCell>
                <TableBodyCell align="right">
                  <TableCellValue align="right">Rp {{ row.amount.toLocaleString('id-ID') }}</TableCellValue>
                </TableBodyCell>
              </TableBodyRow>
            </template>
            <TableEmpty
              v-else
              :colSpan="5"
              title="Order tidak ditemukan"
              description="Tidak ada baris yang cocok dengan kata kunci pencarian Anda."
              :showCTA="true"
              ctaLabel="Reset Pencarian"
              :onCtaClick="() => table.setQuery('')"
            />
          </tbody>
        </Table>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span class="text-xs text-foreground-muted">
            Menampilkan <strong>{{ state.visibleRows.length }}</strong> dari <strong>{{ state.totalItems }}</strong> hasil • Terpilih: <strong>{{ state.selectedIds.length }}</strong> baris
          </span>
          <Pagination v-bind="paginationProps" />
        </div>
      </div>

      <div class="flex flex-col gap-3 rounded-xl border border-border-default bg-background-subtle p-4 lg:col-span-4">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold uppercase tracking-wider text-foreground-muted">Live Controller Snapshot (`getState()`)</h4>
          <span class="rounded-full bg-primary-default/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-default">updates: {{ updateCount }}</span>
        </div>
        <pre class="max-h-80 overflow-x-auto rounded-lg border border-border-default bg-background-default p-3 font-mono text-[11px] leading-relaxed text-foreground-default">{{ snapshotJson }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';
import { createTableController } from '../preview/utils';

const InputText = defineAsyncComponent(() => import('../preview/vue3/InputText.vue'));
const Table = defineAsyncComponent(() => import('../preview/vue3/Table.vue'));
const TableHeaderRow = defineAsyncComponent(() => import('../preview/vue3/TableHeaderRow.vue'));
const TableHeaderCell = defineAsyncComponent(() => import('../preview/vue3/TableHeaderCell.vue'));
const TableCheckboxHeaderCell = defineAsyncComponent(() => import('../preview/vue3/TableCheckboxHeaderCell.vue'));
const TableNoHeaderCell = defineAsyncComponent(() => import('../preview/vue3/TableNoHeaderCell.vue'));
const TableBodyRow = defineAsyncComponent(() => import('../preview/vue3/TableBodyRow.vue'));
const TableBodyCell = defineAsyncComponent(() => import('../preview/vue3/TableBodyCell.vue'));
const TableCheckboxBodyCell = defineAsyncComponent(() => import('../preview/vue3/TableCheckboxBodyCell.vue'));
const TableNoBodyCell = defineAsyncComponent(() => import('../preview/vue3/TableNoBodyCell.vue'));
const TableCellValue = defineAsyncComponent(() => import('../preview/vue3/TableCellValue.vue'));
const TableEmpty = defineAsyncComponent(() => import('../preview/vue3/TableEmpty.vue'));
const Pagination = defineAsyncComponent(() => import('../preview/vue3/Pagination.vue'));

interface OrderRow {
  id: string;
  customer: string;
  email: string;
  status: string;
  badgeStatus: 'success' | 'warning' | 'destructive' | 'info';
  amount: number;
}

const INITIAL_ROWS: OrderRow[] = [
  { id: 'ORD-101', customer: 'Budi Santoso', email: 'budi@komerce.id', status: 'Completed', badgeStatus: 'success', amount: 1450000 },
  { id: 'ORD-102', customer: 'Siti Aminah', email: 'siti@komship.id', status: 'Processing', badgeStatus: 'info', amount: 820000 },
  { id: 'ORD-103', customer: 'Andi Wijaya', email: 'andi@kompack.id', status: 'Pending', badgeStatus: 'warning', amount: 2300000 },
  { id: 'ORD-104', customer: 'Dewi Lestari', email: 'dewi@komerce.id', status: 'Completed', badgeStatus: 'success', amount: 640000 },
  { id: 'ORD-105', customer: 'Rizky Pratama', email: 'rizky@komtim.id', status: 'Cancelled', badgeStatus: 'destructive', amount: 390000 },
  { id: 'ORD-106', customer: 'Nadia Putri', email: 'nadia@komerce.id', status: 'Completed', badgeStatus: 'success', amount: 3150000 },
  { id: 'ORD-107', customer: 'Hendra Gunawan', email: 'hendra@komship.id', status: 'Pending', badgeStatus: 'warning', amount: 1120000 },
];

const table = createTableController<OrderRow>({
  rows: INITIAL_ROWS,
  getRowId: (r) => r.id,
  searchKeys: ['customer', 'email', 'status', 'id'],
  initialPageSize: 3,
  initialSelectedIds: ['ORD-101'],
});

const updateCount = ref(0);
const state = ref(table.getState());
const searchProps = computed(() => { void state.value; return table.bindSearch(); });
const headerCheckboxProps = computed(() => { void state.value; return table.bindHeaderCheckbox(); });
const sortCustomerProps = computed(() => { void state.value; return table.bindHeaderSort('customer'); });
const sortStatusProps = computed(() => { void state.value; return table.bindHeaderSort('status'); });
const sortAmountProps = computed(() => { void state.value; return table.bindHeaderSort('amount'); });
const paginationProps = computed(() => { void state.value; return table.bindPagination(); });

let unsub: (() => void) | undefined;
onMounted(() => {
  unsub = table.subscribe(() => {
    updateCount.value++;
    state.value = table.getState();
  });
});
onBeforeUnmount(() => unsub?.());

const snapshotJson = computed(() =>
  JSON.stringify(
    {
      query: state.value.query,
      sortKey: state.value.sortKey,
      sortDirection: state.value.sortDirection,
      currentPage: state.value.currentPage,
      pageSize: state.value.pageSize,
      totalPages: state.value.totalPages,
      totalItems: state.value.totalItems,
      visibleIds: state.value.visibleIds,
      selectedIds: state.value.selectedIds,
      selectionState: state.value.selectionState,
    },
    null,
    2
  )
);
</script>
