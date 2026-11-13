# Headless Table Controller (`createTableController`)

`@komerce-design/{react,vue3,svelte,vue2,angular}` menyediakan **Headless Table Controller** (`createTableController`) serta fungsi-fungsi tabel murni (`sortTableRows`, `paginateTableRows`, `filterTableRows`, `getSelectionState`, `toggleSelection`, `getVirtualWindow`) yang bekerja secara *plug-and-play* dengan komponen `Table`, `TableHeaderCell`, `TableCheckboxHeaderCell`, `TableBodyRow`, `TableCheckboxBodyCell`, `TableEmpty`, `Pagination`, dan `InputText` di **5 framework**.

## Live Interactive Playground

Uji langsung pencarian (`bindSearch`), tri-state sorting (`bindHeaderSort`), seleksi baris/halaman dengan indikator `indeterminate` (`bindHeaderCheckbox` & `bindRowCheckbox`), serta paginasi (`bindPagination`) di bawah ini:

<HeadlessTablePlayground />

---

## 1. Arsitektur & Alur Data `createTableController`

Komponen `Table*` di Komerce Design System bersifat *composition-first* (stateless presentational elements). `createTableController` mengelola seluruh state tabel tanpa memaksakan struktur kolom atau markup tertentu:

```
Source Rows (rows / setRows)
  │
  ▼
1. Search & Filter (filterTableRows + searchKeys) ──► bindSearch() -> <InputText />
  │
  ▼
2. Tri-State Sorting ('asc' -> 'desc' -> 'none')  ──► bindHeaderSort(key) -> <TableHeaderCell />
  │
  ▼
3. Pagination Slice (paginateTableRows)           ──► bindPagination() -> <Pagination />
  │
  ▼
4. Visible Page Selection (getSelectionState)     ──► bindHeaderCheckbox() / bindRow(id) / bindRowCheckbox(id)
```

Fitur kunci:
- **Tri-State Sorting Otomatis**: Klik pertama pada header kolom mengurutkan `asc`, klik kedua `desc`, dan klik ketiga mengembalikan ke urutan asli (`none`). Numerik dan string berangka diurutkan secara cerdas (`localeCompare` dengan `{ numeric: true }`).
- **Page-Scoped Checkbox & Indeterminate State**: `bindHeaderCheckbox()` menghitung apakah seluruh baris pada halaman aktif (`visibleIds`) sudah terpilih (`checked: true`), sebagian terpilih (`indeterminate: true`), atau belum ada yang terpilih (`checked: false`). Memilih atau membatalkan header checkbox hanya memengaruhi baris di halaman yang sedang tampil (`toggleAllVisible`) tanpa menghapus seleksi di halaman lain.
- **Auto-Reset Page**: Mengubah kata kunci pencarian (`setQuery`), urutan kolom (`toggleSort` / `setSort`), atau ukuran halaman (`setPageSize`) otomatis mengembalikan `currentPage` ke `1`.

---

## 2. Contoh Penggunaan di 5 Framework

::: code-group

```tsx [React]
import React from 'react';
import {
  createTableController,
  InputText,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableCheckboxHeaderCell,
  TableBodyRow,
  TableBodyCell,
  TableCheckboxBodyCell,
  TableCellValue,
  TableEmpty,
  Pagination,
} from '@komerce-design/react';

interface Order {
  id: string;
  customer: string;
  email: string;
  status: 'Completed' | 'Pending';
  amount: number;
}

const ORDERS: Order[] = [
  { id: 'ORD-01', customer: 'Budi Santoso', email: 'budi@komerce.id', status: 'Completed', amount: 1450000 },
  { id: 'ORD-02', customer: 'Siti Aminah', email: 'siti@komship.id', status: 'Pending', amount: 820000 },
  { id: 'ORD-03', customer: 'Andi Wijaya', email: 'andi@kompack.id', status: 'Completed', amount: 2300000 },
];

export function OrdersTable() {
  const [table] = React.useState(() =>
    createTableController({
      rows: ORDERS,
      getRowId: (row) => row.id,
      searchKeys: ['customer', 'email', 'id'],
      initialPageSize: 10,
    })
  );

  const [snap, setSnap] = React.useState(() => table.getState());
  React.useEffect(() => table.subscribe(() => setSnap(table.getState())), [table]);

  return (
    <div className="flex flex-col gap-4">
      <InputText label="Cari Order" placeholder="Cari nama atau ID..." {...table.bindSearch()} />

      <Table caption="Daftar Order Pelanggan">
        <thead>
          <TableHeaderRow>
            <TableCheckboxHeaderCell {...table.bindHeaderCheckbox()} />
            <TableHeaderCell {...table.bindHeaderSort('customer')}>Customer</TableHeaderCell>
            <TableHeaderCell {...table.bindHeaderSort('status')}>Status</TableHeaderCell>
            <TableHeaderCell align="right" {...table.bindHeaderSort('amount')}>Amount</TableHeaderCell>
          </TableHeaderRow>
        </thead>
        <tbody>
          {!snap.isEmpty ? (
            snap.visibleRows.map((row) => (
              <TableBodyRow key={row.id} {...table.bindRow(row.id)}>
                <TableCheckboxBodyCell {...table.bindRowCheckbox(row.id)} />
                <TableBodyCell>
                  <TableCellValue layout="stacked" secondaryText={row.email}>{row.customer}</TableCellValue>
                </TableBodyCell>
                <TableBodyCell>
                  <TableCellValue status={row.status === 'Completed' ? 'success' : 'warning'}>{row.status}</TableCellValue>
                </TableBodyCell>
                <TableBodyCell align="right">
                  <TableCellValue align="right">Rp {row.amount.toLocaleString('id-ID')}</TableCellValue>
                </TableBodyCell>
              </TableBodyRow>
            ))
          ) : (
            <TableEmpty
              colSpan={4}
              title="Order tidak ditemukan"
              description="Coba kata kunci pencarian lain."
              showCTA={true}
              ctaLabel="Reset Filter"
              onCtaClick={() => table.reset()}
            />
          )}
        </tbody>
      </Table>

      <Pagination {...table.bindPagination()} />
    </div>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  createTableController,
  InputText,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableCheckboxHeaderCell,
  TableBodyRow,
  TableBodyCell,
  TableCheckboxBodyCell,
  TableCellValue,
  TableEmpty,
  Pagination,
} from '@komerce-design/vue3';

const table = createTableController({
  rows: [
    { id: 'ORD-01', customer: 'Budi Santoso', email: 'budi@komerce.id', status: 'Completed', amount: 1450000 },
    { id: 'ORD-02', customer: 'Siti Aminah', email: 'siti@komship.id', status: 'Pending', amount: 820000 },
  ],
  getRowId: (row) => row.id,
  searchKeys: ['customer', 'email', 'id'],
  initialPageSize: 10,
});

const snap = ref(table.getState());
let unsub: (() => void) | undefined;

onMounted(() => {
  unsub = table.subscribe(() => { snap.value = table.getState(); });
});
onBeforeUnmount(() => unsub?.());
</script>

<template>
  <div class="flex flex-col gap-4">
    <InputText label="Cari Order" placeholder="Cari nama atau ID..." v-bind="table.bindSearch()" />

    <Table caption="Daftar Order Pelanggan">
      <thead>
        <TableHeaderRow>
          <TableCheckboxHeaderCell v-bind="table.bindHeaderCheckbox()" />
          <TableHeaderCell v-bind="table.bindHeaderSort('customer')">Customer</TableHeaderCell>
          <TableHeaderCell align="right" v-bind="table.bindHeaderSort('amount')">Amount</TableHeaderCell>
        </TableHeaderRow>
      </thead>
      <tbody>
        <template v-if="!snap.isEmpty">
          <TableBodyRow v-for="row in snap.visibleRows" :key="row.id" v-bind="table.bindRow(row.id)">
            <TableCheckboxBodyCell v-bind="table.bindRowCheckbox(row.id)" />
            <TableBodyCell>
              <TableCellValue layout="stacked" :secondaryText="row.email">{{ row.customer }}</TableCellValue>
            </TableBodyCell>
            <TableBodyCell align="right">
              <TableCellValue align="right">Rp {{ row.amount.toLocaleString('id-ID') }}</TableCellValue>
            </TableBodyCell>
          </TableBodyRow>
        </template>
        <TableEmpty v-else :colSpan="3" title="Order tidak ditemukan" :showCTA="true" ctaLabel="Reset" :onCtaClick="() => table.reset()" />
      </tbody>
    </Table>

    <Pagination v-bind="table.bindPagination()" />
  </div>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    createTableController,
    InputText,
    Table,
    TableHeaderRow,
    TableHeaderCell,
    TableCheckboxHeaderCell,
    TableBodyRow,
    TableBodyCell,
    TableCheckboxBodyCell,
    TableCellValue,
    Pagination,
  } from '@komerce-design/svelte';

  const table = createTableController({
    rows: [
      { id: 'ORD-01', customer: 'Budi Santoso', email: 'budi@komerce.id', amount: 1450000 },
      { id: 'ORD-02', customer: 'Siti Aminah', email: 'siti@komship.id', amount: 820000 },
    ],
    getRowId: (row) => row.id,
    searchKeys: ['customer', 'email', 'id'],
  });

  let snap = table.getState();
  const unsub = table.subscribe(() => { snap = table.getState(); });
  onDestroy(unsub);
</script>

<div class="flex flex-col gap-4">
  <InputText label="Cari Order" {...table.bindSearch()} />
  <Table caption="Daftar Order">
    <thead>
      <TableHeaderRow>
        <TableCheckboxHeaderCell {...table.bindHeaderCheckbox()} />
        <TableHeaderCell {...table.bindHeaderSort('customer')}>Customer</TableHeaderCell>
        <TableHeaderCell align="right" {...table.bindHeaderSort('amount')}>Amount</TableHeaderCell>
      </TableHeaderRow>
    </thead>
    <tbody>
      {#each snap.visibleRows as row (row.id)}
        <TableBodyRow {...table.bindRow(row.id)}>
          <TableCheckboxBodyCell {...table.bindRowCheckbox(row.id)} />
          <TableBodyCell><TableCellValue layout="stacked" secondaryText={row.email}>{row.customer}</TableCellValue></TableBodyCell>
          <TableBodyCell align="right"><TableCellValue align="right">Rp {row.amount.toLocaleString('id-ID')}</TableCellValue></TableBodyCell>
        </TableBodyRow>
      {/each}
    </tbody>
  </Table>
  <Pagination {...table.bindPagination()} />
</div>
```

```vue [Vue 2]
<script>
import {
  createTableController,
  InputText,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableCheckboxHeaderCell,
  TableBodyRow,
  TableBodyCell,
  TableCheckboxBodyCell,
  TableCellValue,
  Pagination,
} from '@komerce-design/vue2';

export default {
  components: {
    InputText, Table, TableHeaderRow, TableHeaderCell, TableCheckboxHeaderCell,
    TableBodyRow, TableBodyCell, TableCheckboxBodyCell, TableCellValue, Pagination,
  },
  data() {
    const table = createTableController({
      rows: [
        { id: 'ORD-01', customer: 'Budi Santoso', email: 'budi@komerce.id', amount: 1450000 },
        { id: 'ORD-02', customer: 'Siti Aminah', email: 'siti@komship.id', amount: 820000 },
      ],
      getRowId: (r) => r.id,
    });
    return { table, snap: table.getState() };
  },
  mounted() {
    this.unsub = this.table.subscribe(() => { this.snap = this.table.getState(); });
  },
  beforeDestroy() {
    if (this.unsub) this.unsub();
  },
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <InputText label="Cari Order" v-bind="table.bindSearch()" />
    <Table caption="Daftar Order">
      <thead>
        <TableHeaderRow>
          <TableCheckboxHeaderCell v-bind="table.bindHeaderCheckbox()" />
          <TableHeaderCell v-bind="table.bindHeaderSort('customer')">Customer</TableHeaderCell>
          <TableHeaderCell align="right" v-bind="table.bindHeaderSort('amount')">Amount</TableHeaderCell>
        </TableHeaderRow>
      </thead>
      <tbody>
        <TableBodyRow v-for="row in snap.visibleRows" :key="row.id" v-bind="table.bindRow(row.id)">
          <TableCheckboxBodyCell v-bind="table.bindRowCheckbox(row.id)" />
          <TableBodyCell><TableCellValue layout="stacked" :secondaryText="row.email">{{ row.customer }}</TableCellValue></TableBodyCell>
          <TableBodyCell align="right"><TableCellValue align="right">Rp {{ row.amount.toLocaleString('id-ID') }}</TableCellValue></TableBodyCell>
        </TableBodyRow>
      </tbody>
    </Table>
    <Pagination v-bind="table.bindPagination()" />
  </div>
</template>
```

```ts [Angular]
import { Component, OnDestroy } from '@angular/core';
import { createTableController } from '@komerce-design/angular';

@Component({
  selector: 'app-orders-table',
  template: `
    <div class="flex flex-col gap-4">
      <kd-input-text
        label="Cari Order"
        [value]="snap.query"
        (onValueChange)="table.setQuery($event)"
      ></kd-input-text>

      <kd-table caption="Daftar Order">
        <thead>
          <kd-table-header-row>
            <kd-table-checkbox-header-cell
              [checked]="snap.selectionState.checked"
              [indeterminate]="snap.selectionState.indeterminate"
              (onCheckedChange)="table.toggleAllVisible($event)"
            ></kd-table-checkbox-header-cell>
            <kd-table-header-cell
              [sortable]="true"
              [sortDirection]="snap.sortKey === 'customer' ? snap.sortDirection : 'none'"
              (onSort)="table.toggleSort('customer')"
            >Customer</kd-table-header-cell>
          </kd-table-header-row>
        </thead>
        <tbody>
          <kd-table-body-row
            *ngFor="let row of snap.visibleRows"
            [selected]="snap.selectedIds.includes(row.id)"
          >
            <kd-table-checkbox-body-cell
              [checked]="snap.selectedIds.includes(row.id)"
              (onCheckedChange)="table.toggleRow(row.id, $event)"
            ></kd-table-checkbox-body-cell>
            <kd-table-body-cell>
              <kd-table-cell-value layout="stacked" [secondaryText]="row.email">{{ row.customer }}</kd-table-cell-value>
            </kd-table-body-cell>
          </kd-table-body-row>
        </tbody>
      </kd-table>

      <kd-pagination
        [currentPage]="snap.currentPage"
        [totalPages]="snap.totalPages"
        (onPageChange)="table.setPage($event)"
      ></kd-pagination>
    </div>
  `,
})
export class OrdersTableComponent implements OnDestroy {
  table = createTableController({
    rows: [
      { id: 'ORD-01', customer: 'Budi Santoso', email: 'budi@komerce.id' },
      { id: 'ORD-02', customer: 'Siti Aminah', email: 'siti@komship.id' },
    ],
    getRowId: (r) => r.id,
  });
  snap = this.table.getState();
  private unsub = this.table.subscribe(() => {
    this.snap = this.table.getState();
  });

  ngOnDestroy() {
    this.unsub();
  }
}
```

:::

---

## 3. API Reference (`createTableController`)

### `TableControllerOptions<T>`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `rows` / `data` | `T[]` | `[]` | Array data sumber untuk tabel. |
| `getRowId` | `(row: T, index: number) => string` | `row.id ?? String(index)` | Fungsi penentu ID unik per baris untuk kebutuhan seleksi checkbox. |
| `searchKeys` | `Array<keyof T>` | `Object.keys(row)` | Daftar key properti objek yang dicocokkan saat pencarian `setQuery`. |
| `initialQuery` | `string` | `''` | Kata kunci pencarian awal. |
| `initialSortKey` | `keyof T \| string` | `''` | Kolom yang diurutkan pada saat inisialisasi. |
| `initialSortDirection` | `'asc' \| 'desc' \| 'none'` | `'none'` | Arah urutan awal. |
| `initialPage` | `number` | `1` | Halaman aktif awal (1-indexed). |
| `initialPageSize` | `number` | `10` | Jumlah baris per halaman. |
| `initialSelectedIds` | `string[]` | `[]` | Daftar ID baris yang terpilih pada saat inisialisasi. |

### Metode & *Plug-and-Play Binders*

| Method | Signature | Description |
| :--- | :--- | :--- |
| `getState` | `() => TableSnapshot<T>` | Mengembalikan snapshot `{ rows, visibleRows, filteredRows, sortedRows, allRows, visibleIds, query, sortKey, sortDirection, page, currentPage, pageSize, totalPages, totalItems, hasNext, hasPrev, selectedIds, selectionState, isEmpty }`. |
| `subscribe` | `(listener: () => void) => () => void` | Mendaftarkan listener perubahan state tabel; mengembalikan fungsi `unsubscribe`. |
| `bindSearch` | `() => { value, onValueChange }` | Props siap pakai untuk `<InputText />` pencarian. |
| `bindHeaderSort` | `(key: keyof T \| string) => { sortable: true, sortDirection, onSort }` | Props siap pakai untuk `<TableHeaderCell />` yang dapat diurutkan. |
| `bindHeaderCheckbox` | `() => { checked, indeterminate, onCheckedChange }` | Props siap pakai untuk `<TableCheckboxHeaderCell />` (select/deselect seluruh baris di halaman aktif). |
| `bindRow` | `(id: string) => { selected: boolean }` | Props siap pakai untuk `<TableBodyRow />`. |
| `bindRowCheckbox` | `(id: string) => { checked: boolean, onCheckedChange }` | Props siap pakai untuk `<TableCheckboxBodyCell />`. |
| `bindPagination` | `() => { currentPage, totalPages, onPageChange }` | Props siap pakai untuk `<Pagination />`. |
| `setRows` | `(nextRows: T[]) => void` | Mengganti data sumber tabel secara reaktif (misalnya setelah fetch API selesai). |
| `setQuery` | `(nextQuery: string) => void` | Mengubah query pencarian dan mereset `page = 1`. |
| `toggleSort` | `(key: keyof T \| string) => void` | Mengubah siklus urutan kolom (`asc` → `desc` → `none`) dan mereset `page = 1`. |
| `setSort` | `(key: keyof T \| string, direction: 'asc' \| 'desc' \| 'none') => void` | Mengatur urutan kolom secara eksplisit dan mereset `page = 1`. |
| `setPage` | `(nextPage: number) => void` | Berpindah ke nomor halaman tertentu. |
| `setPageSize` | `(nextSize: number) => void` | Mengubah jumlah baris per halaman dan mereset `page = 1`. |
| `toggleRow` | `(id: string, checked?: boolean) => void` | Memilih atau membatalkan pilihan satu baris berdasarkan `id`. |
| `toggleAllVisible` | `(checked: boolean) => void` | Memilih atau membatalkan pilihan seluruh baris pada halaman yang sedang tampil (`visibleIds`). |
| `clearSelection` | `() => void` | Mengosongkan seluruh `selectedIds`. |
| `reset` | `() => void` | Mengembalikan query, sort, page, pageSize, dan selectedIds ke nilai awal `options`. |

---

## 4. Pure Functional Table & Virtualization Helpers (`core-table`)

Bagi aplikasi yang menggunakan state eksternal (seperti URL query params, Redux/Pinia, atau server-side pagination) maupun tabel berukuran puluhan ribu baris, Anda dapat mengimpor fungsi-fungsi murni berikut secara terpisah:

| Helper Function | Signature | Description |
| :--- | :--- | :--- |
| `filterTableRows` | `<T>(rows: T[], query: string, searchKeys?: Array<keyof T>) => T[]` | Memfilter array objek secara case-insensitive terhadap `query`. |
| `sortTableRows` | `<T>(rows: T[], sortKey: keyof T \| string, direction?: 'asc' \| 'desc') => T[]` | Mengurutkan salinan array secara numerik atau natural-string (`{ numeric: true }`) dengan penempatan nilai `null`/`undefined` yang aman. |
| `paginateTableRows` | `<T>(rows: T[], page?: number, pageSize?: number) => { data, totalPages, totalItems, currentPage, hasNext, hasPrev }` | Memotong array sesuai halaman dan menghitung metadata paginasi dengan batas aman (`1..totalPages`). |
| `getSelectionState` | `(visibleIds: string[], selectedIds: string[]) => { checked: boolean; indeterminate: boolean; count: number }` | Menghitung status checkbox header untuk sekumpulan ID baris yang tampil di layar. |
| `toggleSelection` | `(selectedIds: string[], targetIds: string[], checked: boolean) => string[]` | Menambahkan atau menghapus satu/banyak ID dari daftar seleksi tanpa duplikasi (`Set`). |
| `getVirtualWindow` | `(options: VirtualWindowOptions) => { startIndex, endIndex, virtualItems, paddingTop, paddingBottom, totalHeight }` | Menghitung window baris yang terlihat (`virtualItems: { index, start, size }[]`) beserta spacer `paddingTop`/`paddingBottom` untuk virtual scrolling 10.000+ baris tanpa library tambahan. |

### Contoh Virtual Scrolling (`getVirtualWindow`)

```ts
import { getVirtualWindow } from '@komerce-design/react'; // atau vue3, svelte, vue2, angular

const win = getVirtualWindow({
  totalItems: 10000,
  itemHeight: 48,
  containerHeight: 480,
  scrollTop: 2400,
  overscan: 3,
});
// win.startIndex -> 47, win.endIndex -> 63
// win.paddingTop -> 2256, win.paddingBottom -> 476976, win.totalHeight -> 480000
```
