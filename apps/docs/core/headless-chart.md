# Headless Chart Engine (`getChart*State` & SVG Primitives)

Seluruh komponen visualisasi di `@komerce-design/{react,vue3,svelte,vue2,angular}` ditenagai oleh **Headless Chart Engine (`core-chart` & `core-chart-series`)** — kumpulan fungsi TypeScript murni (100% SSR-safe, 0 dependency eksternal, 0% CSS) yang menghitung normalisasi skala, koordinat SVG/DOM, dan pemformatan tooltip.

> **Mencari komponen siap pakai (`<Chart>`, `<ChartBar>`, `<ChartPie>`, dll.)?**  
> Lihat halaman [Komponen Chart](/components/chart) untuk penggunaan komponen standar dengan preview interaktif. Gunakan halaman ini jika Anda ingin **membangun layout, animasi, atau SVG chart custom sendiri** tanpa menulis ulang matematika skalanya.

## Live Interactive Playground

Uji langsung output **Headless Chart Engine** (`getChartBarState`, `getChartPieState`, `muteSeriesValues`, `computeNiceTicks`, `scaleLinear`, `getSmoothBezierPath`) secara interaktif di bawah ini—klik legend untuk mute seri, ubah mode *Stacked*, atau acak data dan lihat hasil JSON state-nya di panel kanan:

<HeadlessChartPlayground />

---

## Kapan Pakai Komponen Biasa vs Headless Chart Engine?

| Pendekatan | Fungsi / Komponen | Kapan Digunakan |
| :--- | :--- | :--- |
| **Komponen Siap Pakai** | [`<Chart>` + `<ChartBar />`, `<ChartLine />`, dll.](/components/chart) | Kebutuhan standar dashboard Komerce Design System (sudah termasuk tooltip, legend, dan token warna). |
| **Headless State Engine** | `getChartBarState`, `getChartLineState`, `getChartPieState`, dll. | Ingin **markup HTML/SVG atau styling 100% custom** (mis. micro-sparkline, widget dashboard unik, animasi custom), tapi tetap memakai normalisasi persentase, `dashArray`, dan `tooltipText` dari design system. |
| **Series & Axis Helpers** | `muteSeriesValues`, `filterActiveSeries`, `computeNiceTicks` | Ingin membuat **legend interaktif** (klik untuk mute/sembunyikan seri) dan **skala sumbu Y bulat otomatis** (`nice ticks`). |
| **Low-Level SVG Primitives** | `scaleLinear`, `scaleBand`, `getSmoothBezierPath`, `getAreaPath`, `getPieSlices` | Membangun tipe visualisasi SVG baru di luar 9 tipe chart bawaan dengan kendali penuh atas koordinat `viewBox`. |

---

## 1. Contoh Nyata Headless State (`getChartBarState` & `getChartPieState`) di 5 Framework

Alih-alih merender `<ChartBar />` atau `<ChartPie />`, Anda memanggil `getChartBarState(...)` / `getChartPieState(...)` langsung, lalu merender elemen HTML atau `<svg>` milik Anda sendiri dari objek state yang dikembalikan:

::: code-group

```tsx [React]
import React from 'react';
import {
  getChartBarState,
  getChartPieState,
  type ChartTooltipContext,
} from '@komerce-design/react';

const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const REVENUE_DATA = [
  { label: 'Sen', value: 12_500_000 },
  { label: 'Sel', value: 18_400_000 },
  { label: 'Rab', value: 24_000_000 },
];

const CHANNEL_DATA = [
  { label: 'Komship', value: 450 },
  { label: 'Kompack', value: 320 },
  { label: 'Direct', value: 230 },
];

export function CustomHeadlessCharts() {
  // 1. Hitung state bar chart tanpa menyentuh DOM
  const barState = getChartBarState(
    REVENUE_DATA,
    'bg-brand-kompack-primary',
    false,
    25_000_000,
    (ctx: ChartTooltipContext) => `${ctx.label}: ${idr.format(ctx.value)}`,
    (v) => `${(v / 1_000_000).toFixed(1)} Jt`
  );

  // 2. Hitung geometri SVG donut chart (innerRadius = 28)
  const pieState = getChartPieState(CHANNEL_DATA, 28);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Custom HTML Bar Chart dari barState */}
      <div className="rounded-xl border border-border-default p-4">
        <div className="mb-3 text-sm font-semibold">Custom Headless Bar (Max: {barState.max.toLocaleString('id-ID')})</div>
        <div className="flex h-40 items-end gap-4">
          {barState.rows.map((row) => (
            <div key={row.label} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-xs text-foreground-muted">{row.displayValue}</span>
              <div
                title={row.tooltipText}
                className={`w-full rounded-t-md transition-all ${row.bars[0]?.colorClass}`}
                style={{ height: row.height }}
              />
              <span className="text-xs font-medium">{row.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom SVG Donut Chart dari pieState */}
      <div className="flex items-center gap-6 rounded-xl border border-border-default p-4">
        <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
          {pieState.slices.map((slice) => (
            <circle
              key={slice.label}
              cx="50"
              cy="50"
              r={pieState.ringRadius}
              fill="none"
              strokeWidth={pieState.ringWidth}
              strokeDasharray={slice.dashArray}
              strokeDashoffset={slice.dashOffset}
              className={slice.strokeClass}
            >
              <title>{slice.tooltipText}</title>
            </circle>
          ))}
        </svg>
        <ul className="space-y-1.5 text-xs">
          {pieState.slices.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-4">
              <span className="font-medium">{s.label}</span>
              <span className="text-foreground-muted">{s.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

```vue [Vue 3]
<script setup lang="ts">
import { computed } from 'vue';
import { getChartBarState, type ChartTooltipContext } from '@komerce-design/vue3';

const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const rawData = [
  { label: 'Sen', value: 12_500_000 },
  { label: 'Sel', value: 18_400_000 },
  { label: 'Rab', value: 24_000_000 },
];

const barState = computed(() =>
  getChartBarState(
    rawData,
    'bg-brand-kompack-primary',
    false,
    25_000_000,
    (ctx: ChartTooltipContext) => `${ctx.label}: ${idr.format(ctx.value)}`,
    (v) => `${(v / 1_000_000).toFixed(1)} Jt`
  )
);
</script>

<template>
  <div class="rounded-xl border border-border-default p-4">
    <div class="flex h-40 items-end gap-4">
      <div
        v-for="row in barState.rows"
        :key="row.label"
        class="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
      >
        <span class="text-xs text-foreground-muted">{{ row.displayValue }}</span>
        <div
          :title="row.tooltipText"
          :class="['w-full rounded-t-md transition-all', row.bars[0]?.colorClass]"
          :style="{ height: row.height }"
        />
        <span class="text-xs font-medium">{{ row.label }}</span>
      </div>
    </div>
  </div>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { getChartBarState, type ChartTooltipContext } from '@komerce-design/svelte';

  const idr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  const rawData = [
    { label: 'Sen', value: 12_500_000 },
    { label: 'Sel', value: 18_400_000 },
    { label: 'Rab', value: 24_000_000 },
  ];

  $: barState = getChartBarState(
    rawData,
    'bg-brand-kompack-primary',
    false,
    25_000_000,
    (ctx: ChartTooltipContext) => `${ctx.label}: ${idr.format(ctx.value)}`,
    (v) => `${(v / 1_000_000).toFixed(1)} Jt`
  );
</script>

<div class="rounded-xl border border-border-default p-4">
  <div class="flex h-40 items-end gap-4">
    {#each barState.rows as row (row.label)}
      <div class="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
        <span class="text-xs text-foreground-muted">{row.displayValue}</span>
        <div
          title={row.tooltipText}
          class="w-full rounded-t-md transition-all {row.bars[0]?.colorClass}"
          style="height: {row.height}"
        />
        <span class="text-xs font-medium">{row.label}</span>
      </div>
    {/each}
  </div>
</div>
```

```vue [Vue 2]
<script>
import { getChartBarState } from '@komerce-design/vue2';

export default {
  data() {
    return {
      rawData: [
        { label: 'Sen', value: 12500000 },
        { label: 'Sel', value: 18400000 },
        { label: 'Rab', value: 24000000 },
      ],
    };
  },
  computed: {
    barState() {
      return getChartBarState(
        this.rawData,
        'bg-brand-kompack-primary',
        false,
        25000000,
        (ctx) => `${ctx.label}: Rp ${ctx.value.toLocaleString('id-ID')}`,
        (v) => `${(v / 1000000).toFixed(1)} Jt`
      );
    },
  },
};
</script>

<template>
  <div class="rounded-xl border border-border-default p-4">
    <div class="flex h-40 items-end gap-4">
      <div
        v-for="row in barState.rows"
        :key="row.label"
        class="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
      >
        <span class="text-xs text-foreground-muted">{{ row.displayValue }}</span>
        <div
          :title="row.tooltipText"
          :class="['w-full rounded-t-md transition-all', row.bars[0] && row.bars[0].colorClass]"
          :style="{ height: row.height }"
        />
        <span class="text-xs font-medium">{{ row.label }}</span>
      </div>
    </div>
  </div>
</template>
```

```ts [Angular]
import { Component } from '@angular/core';
import { getChartBarState, type ChartTooltipContext } from '@komerce-design/angular';

@Component({
  selector: 'app-headless-bar',
  template: `
    <div class="rounded-xl border border-border-default p-4">
      <div class="flex h-40 items-end gap-4">
        <div
          *ngFor="let row of barState.rows"
          class="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
        >
          <span class="text-xs text-foreground-muted">{{ row.displayValue }}</span>
          <div
            [title]="row.tooltipText"
            [class]="'w-full rounded-t-md transition-all ' + (row.bars[0]?.colorClass || '')"
            [style.height]="row.height"
          ></div>
          <span class="text-xs font-medium">{{ row.label }}</span>
        </div>
      </div>
    </div>
  `,
})
export class HeadlessBarComponent {
  rawData = [
    { label: 'Sen', value: 12_500_000 },
    { label: 'Sel', value: 18_400_000 },
    { label: 'Rab', value: 24_000_000 },
  ];

  barState = getChartBarState(
    this.rawData,
    'bg-brand-kompack-primary',
    false,
    25_000_000,
    (ctx: ChartTooltipContext) => `${ctx.label}: Rp ${ctx.value.toLocaleString('id-ID')}`,
    (v) => `${(v / 1_000_000).toFixed(1)} Jt`
  );
}
```

:::

---

## 2. Interactive Legend & Dynamic Axis Ticks (`core-chart-series`)

Untuk membuat legend yang bisa diklik (toggle aktif/non-aktif per seri) serta skala sumbu Y yang rapi otomatis, gabungkan `toggleListItem`, `muteSeriesValues`, `filterActiveSeries`, dan `computeNiceTicks`:

```tsx
import React from 'react';
import {
  toggleListItem,
  muteSeriesValues,
  computeNiceTicks,
  getChartBarState,
} from '@komerce-design/react';

const MULTI_SERIES = [
  { label: 'Sen', values: [50, 35, 25] },
  { label: 'Sel', values: [80, 45, 30] },
  { label: 'Rab', values: [65, 60, 40] },
];
const SERIES_NAMES = ['Direct', 'Marketplace', 'Affiliate'];

export function InteractiveHeadlessMultiBar() {
  const [mutedSeries, setMutedSeries] = React.useState<number[]>([]);

  // 1. Nol-kan seri yang di-mute agar skala & bar tetap konsisten
  const activeData = muteSeriesValues(MULTI_SERIES, mutedSeries);

  // 2. Hitung batas atas sumbu Y & daftar tick bulat (misal [0, 25, 50, 75, 100])
  const peak = Math.max(10, ...activeData.flatMap((d) => d.values ?? [d.value ?? 0]));
  const nice = computeNiceTicks(peak, 5);

  // 3. Hitung state chart dengan max = nice.max
  const state = getChartBarState(activeData, 'bg-chart-series-1', false, nice.max);

  return (
    <div className="space-y-4">
      {/* Legend Interaktif */}
      <div className="flex gap-2">
        {SERIES_NAMES.map((name, idx) => {
          const isMuted = mutedSeries.includes(idx);
          return (
            <button
              key={name}
              type="button"
              onClick={() => setMutedSeries((prev) => toggleListItem(prev, idx))}
              className={`rounded-md border px-2.5 py-1 text-xs ${isMuted ? 'opacity-40 line-through' : ''}`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Custom Grouped Bars */}
      <div className="flex h-36 items-end gap-6 border-b border-border-default pb-2">
        {state.rows.map((row) => (
          <div key={row.label} className="flex flex-1 items-end justify-center gap-1 h-full">
            {row.bars.map((bar, i) => (
              <div
                key={i}
                title={bar.tooltipText}
                className={`w-3 rounded-t ${bar.colorClass}`}
                style={{ height: bar.height }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

| Helper | Signature | Deskripsi |
| :--- | :--- | :--- |
| `muteSeriesValues` | `<T extends { values?: number[]; value?: number }>(data: ReadonlyArray<T>, mutedIndices: ReadonlyArray<number>) => T[]` | Mengubah nilai pada indeks seri yang ada di `mutedIndices` menjadi `0` (baik pada `values[]` maupun single-series `value`) tanpa memutasi array sumber. |
| `filterActiveSeries` | `<T extends { series?: number }>(data: ReadonlyArray<T>, mutedIndices: ReadonlyArray<number>) => T[]` | Menyaring titik data scatter (`{ series?: number }`) yang serinya tidak sedang di-mute. |
| `computeNiceTicks` | `(maxValue: number, count?: number) => { max: number; ticks: number[] }` | Menghitung nilai maksimum sumbu Y yang dibulatkan rapi beserta array `ticks` turunannya (default `count = 5`). |

---

## 3. Low-Level SVG Scales & Path Generators (Full Custom SVG)

Untuk visualisasi SVG custom sepenuhnya di luar 9 tipe chart standar, gunakan `scaleLinear`, `scaleBand`, `getSmoothBezierPath`, `getAreaPath`, dan `getPieSlices`:

```tsx
import {
  scaleLinear,
  scaleBand,
  getSmoothBezierPath,
  getAreaPath,
} from '@komerce-design/react';

const WEEKLY = [
  { day: 'Sen', value: 120 },
  { day: 'Sel', value: 80 },
  { day: 'Rab', value: 165 },
  { day: 'Kam', value: 140 },
  { day: 'Jum', value: 190 },
];

export function CustomBezierSvgChart() {
  const width = 320;
  const height = 120;

  const yScale = scaleLinear({ domain: [0, 200], range: [height, 10] });
  const xScale = scaleBand({
    domain: WEEKLY.map((d) => d.day),
    range: [16, width - 16],
    padding: 0.2,
  });

  const points = WEEKLY.map((d) => ({
    x: xScale(d.day) + xScale.bandwidth / 2,
    y: yScale(d.value),
    label: d.day,
    value: d.value,
  }));

  const linePath = getSmoothBezierPath(points);
  const areaPath = getAreaPath(points, height);
  const gridTicks = yScale.ticks(4);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md overflow-visible">
      {/* Horizontal Grid Lines */}
      {gridTicks.map((tick) => (
        <line
          key={tick}
          x1={0}
          x2={width}
          y1={yScale(tick)}
          y2={yScale(tick)}
          className="stroke-border-subtle"
          strokeDasharray="3 3"
        />
      ))}

      {/* Area Fill & Smooth Cubic Bezier Curve */}
      <path d={areaPath} className="fill-chart-series-1/15" />
      <path d={linePath} fill="none" strokeWidth={2.5} className="stroke-chart-series-1" />

      {/* Interactive Points (origin-center + transform-box:fill-box mencegah dot melompat saat hover) */}
      {points.map((pt) => (
        <g key={pt.label}>
          <circle
            cx={pt.x}
            cy={pt.y}
            r={4}
            className="pointer-events-none origin-center fill-background-default stroke-chart-series-1 transition-transform [transform-box:fill-box] hover:scale-125"
            strokeWidth={2}
          />
          <circle cx={pt.x} cy={pt.y} r={12} fill="transparent" className="cursor-pointer">
            <title>{`${pt.label}: ${pt.value}`}</title>
          </circle>
        </g>
      ))}
    </svg>
  );
}
```

> **Tip SVG Hover & Floating Tooltip:** Jangan pernah memasang `hover:scale-*` pada `<circle>` SVG tanpa `[transform-box:fill-box] origin-center`, karena browser men-scale koordinat `(cx, cy)` relatif terhadap pojok kiri-atas `(0, 0)` SVG sehingga titik akan melompat/glitch. Untuk **floating tooltip**, **crosshair**, dan **zoom/pan**, gunakan `getNearestPointIndex`, `zoomRangeAt`, `panZoomRange`, dan `sliceChartWindow` seperti pada playground interaktif di atas.

| Primitif SVG & Viewport | Signature | Deskripsi |
| :--- | :--- | :--- |
| `scaleLinear` | `({ domain: [number, number], range: [number, number] }) => ((val: number) => number) & { ticks: (count?: number) => number[] }` | Memetakan nilai kontinu dari `domain` ke `range` serta menyediakan generator `.ticks(count)` untuk garis grid sumbu. |
| `scaleBand` | `({ domain: string[], range: [number, number], padding?: number }) => ((key: string) => number) & { bandwidth: number; step: number }` | Memetakan kategori diskrit ke posisi koordinat beserta lebar batang (`bandwidth`) dan jarak antar kategori (`step`). |
| `getSmoothBezierPath` | `(points: Array<{ x: number; y: number }>) => string` | Menghasilkan string path SVG kurva kubik Bézier mulus (`M x0 y0 C ...`) yang melewati seluruh titik `(x, y)`. |
| `getAreaPath` | `(points: Array<{ x: number; y: number }>, baselineY?: number) => string` | Menghasilkan path SVG kurva tertutup (`M ... C ... L lastX baselineY L firstX baselineY Z`) untuk fill area di bawah garis. |
| `getPieSlices` | `(values: number[], radius?: number, innerRadius?: number) => Array<{ index, value, fraction, startAngle, endAngle, path, isDonut }>` | Menghitung sudut radian dan string path busur SVG (`M ... A ... Z`) untuk sektor Pie (`innerRadius = 0`) maupun Donut (`innerRadius > 0`). |
| `zoomRangeAt` | `(range, factor, anchorRatio?, totalCount?, minSpan?) => [number, number]` | Menghitung window indeks `[start, end]` saat zoom in (`factor < 1`) atau zoom out (`factor > 1`) dengan titik jangkar kursor. |
| `panZoomRange` | `(range, deltaItems, totalCount, minSpan?) => [number, number]` | Menggeser window zoom secara horizontal tanpa melewati batas array data. |
| `sliceChartWindow` | `<T>(data: T[], range?: [number, number]) => T[]` | Memotong array data sesuai `zoomRange` aktif sebelum dikirim ke `getChart*State` atau komponen `ChartLine`/`ChartBar`. |
| `getNearestPointIndex` | `(ratio: number, count: number) => number` | Memetakan rasio posisi kursor horizontal (`0..1`) ke indeks titik terdekat untuk crosshair & floating tooltip. |
| `getChartTooltipAnchor` | `(text, targetEl, containerEl, offset?) => ChartTooltipAnchor` | Menghitung posisi `{ open, text, left, top }` tooltip HTML yang menempel tepat di atas elemen bar/SVG yang di-hover relatif terhadap container chart. |
| `getSvgTooltipAnchor` | `(text, cx, cy, viewWidth, viewHeight, offsetPx?) => ChartTooltipAnchor` | Menghitung posisi persentase `{ open, text, left, top }` tooltip HTML dari koordinat `viewBox` SVG tanpa mengukur DOM. |

---

## 4. Referensi 9 Fungsi State Engine (`getChart*State`) & `ChartTooltipContext`

Semua fungsi di bawah ini menerima callback opsional `formatTooltip?: (ctx: ChartTooltipContext) => string` dan `formatValue?: (value: number) => string` serta mengembalikan struktur geometri siap-render:

```ts
export interface ChartTooltipContext {
  label: string;        // Label kategori / sumbu X (misal: 'Mon', 'Q1', 'Leads')
  value: number;        // Nilai numerik titik data
  seriesIndex?: number; // Indeks seri pada multi-series chart (0, 1, 2, ...)
  total?: number;       // Total keseluruhan / stacked total pada baris tersebut
  percentage?: number;  // Persentase terhadap total (0..100)
  x?: number;           // Nilai koordinat X (khusus ChartScatter)
  y?: number;           // Nilai koordinat Y (khusus ChartScatter)
  kind?: string;        // 'total' | 'positive' | 'negative' (khusus ChartWaterfall)
}
```

| Fungsi | Signature | Return Value Utama |
| :--- | :--- | :--- |
| `getChartBarState` | `(data?: ChartPt[], defaultColorClass?: string, stacked?: boolean, maxScale?: number, formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ max: number, rows: Array<{ label, height, value, displayValue, tooltipText, bars: Array<{ value, displayValue, height, colorClass, tooltipText }> }> }` |
| `getChartLineState` | `(data?: ChartPt[], defaultStroke?: string, defaultFill?: string, maxScale?: number, formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ max: number, labels: string[], series: Array<{ strokeClass, fillClass, points: string, areaPoints: string, dots: Array<{ x, y, leftPct, topPct, value, displayValue, label, tooltipText }> }> }` |
| `getChartPieState` | `(data?: ChartPt[], innerRadius?: number, formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ total: number, ringRadius: number, ringWidth: number, slices: Array<{ label, value, displayValue, percentage, dashArray, dashOffset, strokeClass, tooltipText }> }` |
| `getChartHorizontalBarState` | `(data?: ChartPt[], defaultColorClass?: string, maxScale?: number, valueSuffix?: string, formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ max: number, rows: Array<{ label, value, width: string, displayValue: string, colorClass: string, tooltipText: string }> }` |
| `getChartScatterState` | `(data?: ChartScatterPt[], maxX?: number, maxY?: number, formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ points: Array<{ label, x, y, left: string, top: string, colorClass: string, tooltipText: string }> }` |
| `getChartRadarState` | `(data?: ChartPt[], rings?: number, maxScale?: number, formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ gridPolygons: string[], axes: Array<{ x1, y1, x2, y2, labelX, labelY, label }>, series: Array<{ strokeClass, fillClass, points: string, dots: Array<{ x, y, leftPct, topPct, value, displayValue, label, tooltipText }> }> }` |
| `getChartGaugeState` | `(value?: number, min?: number, max?: number, customTooltip?: string \| ((ctx) => string), formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ value: number, displayValue: string, percentage: number, percentageLabel: string, trackPath: string, fillPath: string, dashArray: string, tooltipText: string }` |
| `getChartFunnelState` | `(data?: ChartPt[], formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ stages: Array<{ label, value, displayValue, width: string, percentage: number, colorClass: string, tooltipText: string }> }` |
| `getChartWaterfallState` | `(data?: ChartWaterfallPt[], maxScale?: number, formatTooltip?: (ctx) => string, formatValue?: (val) => string)` | `{ max: number, bars: Array<{ label, value, displayValue, bottom: string, height: string, kind: 'total' \| 'positive' \| 'negative', colorClass: string, tooltipText: string }> }` |
