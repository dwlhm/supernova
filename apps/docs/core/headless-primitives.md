# Date, Overlay & Accessibility Primitives (`core-date`, `core-overlay`, `core-a11y`)

Seluruh paket `@komerce-design/{react,vue3,svelte,vue2,angular}` dibangun di atas **3-Tier Pure Headless Architecture**:

1. **Tier 1 (`core-*.ts`)**: Fungsi TypeScript murni untuk state, kalkulasi geometri/tanggal, dan atribut WAI-ARIA 1.2 — **100% SSR-safe**, **0% CSS/Tailwind**, dan **0 hardcoded dummy data**.
2. **Tier 2 (`adapter-*.ts` & `bindControllerProps`)**: Adapter reaktivitas native masing-masing framework (React hooks, Vue 3 `<script setup>`, Svelte reactive stores, Vue 2 Options API, Angular `@Input`/`@Output`) serta jembatan sinkronisasi controlled/uncontrolled props (`bindControllerProps`).
3. **Tier 3 (`src/components/*.lite.tsx`)**: Komponen UI deklaratif berukuran ringkas ($\le 80$ baris) yang memetakan Design Tokens ke struktur DOM.

Halaman ini mendokumentasikan primitif Tier 1 & Tier 2 untuk **Date & Calendar**, **Overlay & Dialog**, **Roving Keyboard Focus (WAI-ARIA 1.2)**, serta **Controllable State & Class Utilities** yang dapat Anda impor langsung dari `@komerce-design/*`.

---

## 1. Headless Date & Natural-Language Parser (`core-date`)

Komponen `<DatePicker />` ditenagai oleh mesin tanggal UTC bebas-timezone-drift serta parser bahasa alami dwibahasa (**Bahasa Indonesia & Bahasa Inggris**).

### A. Natural-Language Date Parser (`parseDateInput`)

`parseDateInput(raw, fallbackYear?, fallbackMonth?)` menerjemahkan ekspresi teks bebas maupun tanggal terformat menjadi `{ year, month, day } | null`:

| Kategori Ekspresi | Contoh Input Valid (ID & EN) | Hasil Resolusi |
| :--- | :--- | :--- |
| **Relatif Harian** | `"hari ini"`, `"today"`, `"now"`, `"besok"`, `"tomorrow"`, `"kemarin"`, `"yesterday"` | Tanggal hari ini / $+1$ hari / $-1$ hari |
| **Offset $N$ Hari / Minggu / Bulan** | `"3 hari lagi"`, `"in 3 days"`, `"5 hari yang lalu"`, `"2 minggu lagi"`, `"in 2 weeks"`, `"bulan depan"`, `"3 bulan lagi"` | Menghitung offset kalender UTC secara presisi |
| **Hari Kerja Berikutnya** | `"hari senin"`, `"hari jumat"`, `"next monday"`, `"next friday"` | Tanggal hari tersebut pada siklus 1–7 hari ke depan |
| **Format ISO & Numerik** | `"2026-08-17"`, `"17/08/2026"`, `"17-08-2026"` | Mendeteksi `YYYY-MM-DD`, `DD/MM/YYYY`, dan `MM/DD/YYYY` dengan clamping jumlah hari bulan terkait (termasuk tahun kabisat) |
| **Nama Bulan (ID & EN)** | `"17 Agustus 2026"`, `"17 Agu 2026"`, `"August 17, 2026"`, `"10 Mei 2026"` | Mendukung singkatan & nama bulan Indonesia (`Mei`, `Agu`, `Okt`, `Des`) maupun Inggris |

```ts
import { parseDateInput, buildCalendarPanel, createDatePickerFormatArg } from '@komerce-design/react';

// 1. Parse ekspresi bahasa alami Indonesia / Inggris
const parsed = parseDateInput('3 hari lagi', 2026, 8);
// -> { year: 2026, month: 8, day: 4 }

// 2. Bangun matriks sel kalender 35/42 hari lengkap dengan status range
const panel = buildCalendarPanel(2026, 8, {
  rangeStartKey: 20260810,
  rangeEndKey: 20260817,
  todayDay: 10,
});
// panel.cells -> Array<{ key, day, month, year, isOutside, isToday, isSelected, isRangeStart, isRangeEnd, isInRange }>
```

### B. Konteks Callback `DatePickerFormatArg` (`hint` & `displayValue`)

Pada `<DatePicker />`, prop `hint` dan `displayValue` menerima fungsi `(date: DatePickerFormatArg) => string`. Objek `date` merupakan instance `Date` standar JavaScript (sehingga Anda bisa langsung memanggil `date.toLocaleDateString('id-ID', ...)` atau `Intl.DateTimeFormat`) yang diperkaya dengan properti `DatePickerValueContext`:

```ts
export interface DatePickerValueContext {
  year: number;            // Tahun terpilih (misal 2026)
  month: number;           // Bulan terpilih 1..12
  day: number;             // Tanggal terpilih 1..31
  iso: string;             // String ISO ('2026-08-17', '2026-08', atau '2026')
  formatted: string;       // Label human-readable ('August 17, 2026')
  time: string;            // Waktu pendamping saat showTime={true} ('10:30:00')
  startDate: Date | null;  // Instance Date awal (mode="range" / "single")
  endDate: Date | null;    // Instance Date akhir (mode="range")
  range: string;           // Rentang terformat ('Aug 10, 2026 – Aug 17, 2026')
  mode: 'single' | 'range' | 'month' | 'year';
  hasValue: boolean;       // true jika user sudah memilih tanggal
}
```

### C. Tabel Referensi Fungsi `core-date`

| Fungsi | Signature | Deskripsi |
| :--- | :--- | :--- |
| `buildCalendarPanel` | `(year: number, month: number, opts?: { selectedKey?, rangeStartKey?, rangeEndKey?, todayDay?, showPrev?, showNext? }) => CalendarPanel` | Menghasilkan struktur 1 panel bulan kalender beserta 35/42 `CalendarCell` (termasuk leading/trailing days bulan sebelah dan highlight rentang tanggal). |
| `getCalendarDays` | `(year?: number, month?: number) => { year, month, daysInMonth, leadingBlanks, leadingDays, days, trailingDays, monthLabel, monthShortLabel }` | Menghitung jumlah hari dalam bulan, hari pertama (`0..6`), dan daftar angka hari bulan sebelum/sesudahnya. |
| `getMonthGridEntries` | `(selectedMonth?: number) => MonthGridEntry[]` | Menghasilkan 12 item grid bulan (`Jan`..`Dec`) untuk `mode="month"`. |
| `getYearGridEntries` | `(selectedYear?: number, baseYear?: number) => YearGridEntry[]` | Menghasilkan 9 item grid tahun ($3\times 3$) untuk `mode="year"`. |
| `shiftYearMonth` | `(year: number, month: number, delta: number) => { year: number; month: number }` | Menggeser bulan maju/mundur sebanyak `delta` bulan dengan penanganan pergantian tahun otomatis. |
| `toDateKey` | `(year: number, month: number, day: number) => number` | Mengonversi tanggal menjadi integer `YYYYMMDD` (misal `20260817`) untuk perbandingan `<` / `>` / `===` yang cepat. |
| `formatHumanDate` | `(year?: number, month?: number, day?: number) => string` | Memformat tanggal menjadi `'Month DD, YYYY'` (misal `'June 15, 2025'`). |
| `formatDateDisplay` | `(year?: number, month?: number, day?: number, displayValue?: string) => string` | Mengembalikan `displayValue` jika tersedia, atau fallback ke `'YYYY-MM-DD'`. |
| `getPaginationEntries` | `(current?: number, total?: number) => PaginationEntry[]` | Menghasilkan deret tombol nomor halaman dan ellipsis (`...`) otomatis untuk `<Pagination />`. |
| `getBreadcrumbItems` | `<T>(items: T[], collapsed?: boolean) => Array<T & { originalIndex: number; isEllipsis?: boolean }>` | Menciutkan daftar breadcrumb $>4$ item menjadi `[first, '...', secondLast, last]` saat `collapsed={true}`. |

---

## 2. Headless Overlay, Tabs & Keyboard Navigation (`core-overlay` & `core-a11y`)

Seluruh komponen overlay (`AlertDialog`, `Tooltip`, `Toast`) dan grup navigasi (`Tabs`, `ToggleGroup`, `InputOTP`) mematuhi spesifikasi **WAI-ARIA 1.2** menggunakan helper bebas-framework berikut:

| Fungsi | Signature | Deskripsi |
| :--- | :--- | :--- |
| `createDialogState` | `(options?: { id?: string; open?: boolean; showDescription?: boolean; onClose?: () => void })` | Menghasilkan `{ isOpen, titleId, descriptionId, getBackdropProps, getContentProps, getTitleProps, getDescriptionProps }` lengkap dengan atribut `role="alertdialog" \| "dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, klik backdrop, dan penutupan via tombol `Escape`. |
| `createTabsState` | `<T extends { id: string }>(options: { tabs: T[]; activeId?: string; onSelect?: (id: string) => void })` | Menghasilkan `{ activeId, getTabListProps, getTabTriggerProps, getTabPanelProps }` dengan `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, dan *roving `tabIndex`* (`0` untuk aktif, `-1` untuk non-aktif). |
| `createTooltipState` | `(options?: { id?: string }) => { id, getTriggerProps, getContentProps }` | Menghubungkan elemen pemicu (`aria-describedby`) dengan bubble `role="tooltip"`. |
| `handleGroupKeyDown` | `(event: { key?: string; preventDefault?: () => void; currentTarget?: unknown; target?: unknown }) => void` | Menangani *roving focus* keyboard (`ArrowRight`, `ArrowDown`, `ArrowLeft`, `ArrowUp`, `Home`, `End`) pada container `[role="tablist"]` atau `[role="group"]` dengan melewati elemen yang `disabled`. |
| `handleRovingFocus` | `(event, currentIndex: number, totalItems: number, onSelect: (index: number) => void) => void` | Menghitung indeks item berikutnya saat tombol panah/Home/End ditekan dan memindahkan fokus DOM secara aman. |
| `getNextRovingIndex` | `(key: string, currentIndex: number, totalItems: number) => number` | Fungsi murni yang menghitung indeks fokus berikutnya (wrapping melingkar `0 .. totalItems - 1`) atau `-1` jika tombol bukan navigasi. |
| `focusElementSafely` | `(el: unknown) => void` | Memanggil `.focus()` hanya jika target merupakan elemen DOM yang memiliki metode `focus` (aman dijalankan di SSR). |
| `focusSiblingInput` | `(event: unknown, offset: number) => void` | Memindahkan fokus ke elemen `<input>` tetangga pada offset $+1$ atau $-1$ (digunakan oleh `InputOTP`). |

### Contoh Penggunaan `createDialogState` & `handleGroupKeyDown`

```tsx
import { createDialogState, handleGroupKeyDown } from '@komerce-design/react';

// 1. Headless Dialog ARIA & Escape Key Binding
const dialog = createDialogState({
  id: 'delete-order-modal',
  open: isOpen,
  showDescription: true,
  onClose: () => setIsOpen(false),
});

// <div {...dialog.getBackdropProps()} />
// <div {...dialog.getContentProps('alertdialog')}>
//   <h2 {...dialog.getTitleProps()}>Hapus Order?</h2>
//   <p {...dialog.getDescriptionProps()}>Tindakan ini tidak dapat dibatalkan.</p>
// </div>

// 2. Roving Keyboard Focus pada Custom Toolbar / ToggleGroup
// <div role="group" onKeyDown={handleGroupKeyDown}>
//   <button type="button">Kiri</button>
//   <button type="button">Tengah</button>
//   <button type="button">Kanan</button>
// </div>
```

---

## 3. Headless Overlay Controller (`createOverlayController`)

Untuk mengelola antrean **Toast** (`<ToastViewport />` / `<Toast />`) dan **AlertDialog** (`<AlertDialog />`) secara terpusat tanpa menyebabkan parent/halaman ikut re-render, gunakan `createOverlayController`:

- **Toast Queue & Auto-Dismiss Timer**: Mendukung `notify`, `info`, `success`, `warning`, `error`, dan `promise` (otomatis berubah dari *loading* ke *success*/*error*), lengkap dengan `pauseToast(id?)`, `resumeToast(id?)`, `dismissToast(id?)`, `dismissAllToasts()`, dan `setToastPlacement(placement)`.
- **AlertDialog Promise (`confirm`)**: Mendukung `openDialog(...)` dan `await overlay.confirm({ heading, description, destructive })` yang mengembalikan `Promise<boolean>`.
- **Zero Parent Re-render (`bindToast` / `bindDialog`)**: Mengirimkan `__store` yang kompatibel dengan `useSyncExternalStore` (React), Svelte `$store`, maupun RxJS `Subscribable` (Angular).

```tsx
import {
  createOverlayController,
  ToastViewport,
  Toast,
  AlertDialog,
  Button,
} from '@komerce-design/react';

// Dapat didefinisikan di luar komponen (singleton module store)
export const overlay = createOverlayController({
  defaultPlacement: 'top-right',
  defaultDuration: 4000,
  maxToasts: 20,
});

export function OverlayHost() {
  return (
    <>
      <ToastViewport placement={overlay.getToastPlacement()}>
        <Toast {...overlay.bindToast()} />
      </ToastViewport>
      <AlertDialog {...overlay.bindDialog()} />
    </>
  );
}

export function OrderActions() {
  const handleDelete = async () => {
    const ok = await overlay.confirm({
      heading: 'Hapus Order?',
      description: 'Data order yang dihapus tidak dapat dikembalikan.',
      confirmLabel: 'Hapus',
      destructive: true,
    });
    if (!ok) return;

    await overlay.promise(fetch('/api/orders/1', { method: 'DELETE' }), {
      loading: 'Menghapus order...',
      success: 'Order berhasil dihapus.',
      error: 'Gagal menghapus order.',
    });
  };

  return <Button variant="destructive" onClick={handleDelete}>Hapus Order</Button>;
}
```

---

## 4. Collection, Virtualization & Floating Utilities (`core-collection`, `core-virtual`, `core-floating`)

Primitif murni untuk pengolahan data list, virtualisasi scroll, dan tata letak tumpukan (*stack/deck*):

| Fungsi | Signature | Deskripsi |
| :--- | :--- | :--- |
| `groupByKey` | `<T, K extends string>(items: ReadonlyArray<T>, getKey: (item: T) => K) => Record<K, T[]>` | Mengelompokkan array objek berdasarkan kunci string secara imutabel. |
| `toggleListItem` | `<T>(items: ReadonlyArray<T>, value: T) => T[]` | Menambah item jika belum ada, atau menghapusnya jika sudah ada (ideal untuk multi-select & mute legend). |
| `filterByCriteria` | `<T extends Record<string, any>>(items: ReadonlyArray<T>, criteria: Record<string, unknown>) => T[]` | Menyaring array objek berdasarkan pasangan key-value aktif. |
| `retainValidIds` | `(selectedIds: ReadonlyArray<string>, validIds: ReadonlyArray<string>) => string[]` | Membuang ID seleksi yang sudah tidak ada di daftar data terbaru. |
| `getVirtualWindow` | `({ totalCount, itemHeight, containerHeight, scrollTop, overscan? }) => { startIndex, endIndex, offsetTop, totalHeight, visibleCount }` | Menghitung rentang indeks yang terlihat di viewport untuk tabel/list ribuan baris. |
| `parseFloatingPlacement` | `(placement?: string, fallback?: FloatingPlacement) => ParsedFloatingPlacement` | Mem-parsing 6 posisi floating (`top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`). |
| `computeDeckOffset` / `computeStackOffset` | `(index, total, opts)` | Menghitung translasi dan skala kartu tumpukan 3D (*deck*) maupun *expanded list*. |

---

## 5. Controllable State & Styling Utilities (`core-controller` & `core-a11y`)

| Fungsi | Signature | Deskripsi |
| :--- | :--- | :--- |
| `bindControllerProps` | `<P>(rawProps: P, state: Record<string, any>, setState: (updater) => void) => P` | Jembatan state hibrida (*controlled & uncontrolled*) yang memungkinkan setiap komponen Komerce Design bekerja interaktif secara mandiri (uncontrolled) sekaligus langsung patuh ketika dikontrol oleh props framework atau `createFormController` / `createTableController`. |
| `resolveControllable` | `<T>(controlled: T \| undefined, internal: T \| undefined, fallback: T) => T` | Memilih nilai `controlled` jika didefinisikan, fallback ke state `internal`, lalu `fallback` default. |
| `resolveId` | `(id: string \| undefined, fallback: string) => string` | Menjamin atribut `id` HTML/ARIA selalu non-kosong dan bebas spasi liar. |
| `clampPercent` | `(val: number \| undefined, min?: number, max?: number) => number` | Menormalisasi angka pada rentang `[min, max]` menjadi persentase bulat `0..100` (digunakan oleh `Progressbar` dan `Slider`). |
| `cn` | `(...inputs: ClassValue[]) => string` | Menggabungkan class kondisional (`clsx`) dan menyelesaikan konflik utility Tailwind (`tailwind-merge`) sehingga `props.className` dari consumer selalu menang tanpa spesifisitas ganda. |
| `cva` | `<T>(key: string \| undefined, map: Record<string, T>, fallback: string) => T` | Pemilih varian deterministik dengan fallback aman ketika `key` kosong atau tidak dikenali. |
