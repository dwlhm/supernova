<template>
  <div class="my-2 flex flex-col gap-5 rounded-2xl border border-border-default bg-background-default p-6 text-foreground-default shadow-xs">
    <!-- Header & Controls -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border-default pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-primary-default"></span>
          <h3 class="text-base font-bold tracking-tight text-foreground-default">
            Interactive Headless Chart Playground
          </h3>
        </div>
        <p class="mt-1 text-xs text-foreground-muted">
          100% custom HTML/SVG rendering yang ditenagai oleh <code>getChartBarState</code>, <code>getChartPieState</code>, <code>muteSeriesValues</code>, <code>computeNiceTicks</code>, <code>zoomRangeAt</code>, <code>panZoomRange</code>, <code>getNearestPointIndex</code>, dan <code>scaleLinear</code> + <code>getSmoothBezierPath</code>.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          :class="activeTab === tab.id
            ? 'border-primary-default bg-primary-default text-primary-foreground'
            : 'border-border-default bg-background-subtle text-foreground-default hover:bg-background-muted'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-lg border border-border-default bg-background-subtle px-3 py-1.5 text-xs font-medium text-foreground-default hover:bg-background-muted"
          @click="randomizeData"
        >
          Acak Data
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left: Custom Rendered Chart -->
      <div class="flex flex-col gap-4 lg:col-span-7">
        <!-- TAB 1: Headless Bar + Interactive Legend -->
        <template v-if="activeTab === 'bar'">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="(name, idx) in SERIES_NAMES"
                :key="name"
                type="button"
                class="flex cursor-pointer items-center gap-1.5 rounded-md border border-border-default px-2.5 py-1 text-xs font-medium transition-opacity"
                :class="mutedSeries.includes(idx) ? 'opacity-40 line-through' : 'bg-background-subtle'"
                @click="toggleSeries(idx)"
              >
                <span class="h-2.5 w-2.5 rounded-full" :class="SERIES_COLORS[idx]"></span>
                {{ name }}
              </button>
            </div>
            <label class="flex cursor-pointer items-center gap-1.5 text-xs text-foreground-muted">
              <input v-model="stacked" type="checkbox" class="accent-primary-default" />
              Stacked Mode
            </label>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 text-xs text-foreground-muted">
              <button type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 hover:bg-background-muted" @click="zoomIn" title="Zoom In">+</button>
              <button type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 hover:bg-background-muted" @click="zoomOut" title="Zoom Out">-</button>
              <button type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 hover:bg-background-muted" @click="panLeft" title="Pan Left">←</button>
              <button type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 hover:bg-background-muted" @click="panRight" title="Pan Right">→</button>
              <button v-if="isZoomed" type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 text-[11px] hover:bg-background-muted" @click="resetZoom">Reset</button>
              <span class="ml-1 font-mono text-[11px]">{{ zoomRange[0] + 1 }}–{{ zoomRange[1] }}/{{ multiRows.length }}</span>
            </div>
            <span class="text-[11px] text-foreground-muted">Scroll wheel untuk zoom • Hover untuk tooltip</span>
          </div>

          <div
            ref="barChartRef"
            class="relative flex h-56 items-end gap-4 rounded-xl border border-border-subtle bg-background-subtle/50 p-4 pt-8"
            @wheel.prevent="onWheelZoom($event)"
            @mouseleave="barTooltip = { open: false, text: '', x: 0, y: 0, left: '0px', top: '0px' }"
          >
            <!-- Floating HTML Tooltip anchored to hovered bar -->
            <div
              v-if="barTooltip.open"
              role="tooltip"
              class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-primary-default px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-primary-foreground shadow-md transition-all duration-100"
              :style="{ left: barTooltip.left, top: barTooltip.top }"
            >
              {{ barTooltip.text }}
            </div>

            <!-- Y-Axis Nice Ticks (top=max, bottom=0) -->
            <div class="flex h-full flex-col justify-between pr-2 text-right text-[11px] text-foreground-muted">
              <span v-for="tick in nice.ticks" :key="tick">{{ tick }}</span>
            </div>

            <!-- Custom HTML Bars from getChartBarState -->
            <div class="flex h-full flex-1 items-end gap-3 border-b border-l border-border-default px-3 pb-1">
              <div
                v-for="row in barState.rows"
                :key="row.label"
                class="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span class="text-[11px] font-medium text-foreground-muted">{{ row.displayValue }}</span>
                <div
                  v-if="stacked"
                  class="flex w-full max-w-[40px] flex-col-reverse overflow-hidden rounded-t-md"
                  :style="{ height: row.height }"
                >
                  <div
                    v-for="(bar, bi) in row.bars"
                    :key="bi"
                    class="w-full cursor-pointer transition-all duration-150 hover:brightness-110"
                    :class="bar.colorClass"
                    :style="{ height: bar.height }"
                    @mouseenter="showBarTooltip(bar.tooltipText, $event)"
                  />
                </div>
                <div v-else class="flex h-full w-full items-end justify-center gap-1">
                  <div
                    v-for="(bar, bi) in row.bars"
                    :key="bi"
                    class="w-2.5 cursor-pointer rounded-t-sm transition-all duration-150 hover:brightness-110"
                    :class="bar.colorClass"
                    :style="{ height: bar.height }"
                    @mouseenter="showBarTooltip(bar.tooltipText, $event)"
                  />
                </div>
                <span class="text-xs font-medium text-foreground-default">{{ row.label }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- TAB 2: Low-Level SVG Bezier -->
        <template v-else-if="activeTab === 'svg'">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 text-xs text-foreground-muted">
              <button type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 hover:bg-background-muted" @click="zoomIn" title="Zoom In">+</button>
              <button type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 hover:bg-background-muted" @click="zoomOut" title="Zoom Out">-</button>
              <button type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 hover:bg-background-muted" @click="panLeft" title="Pan Left">←</button>
              <button type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 hover:bg-background-muted" @click="panRight" title="Pan Right">→</button>
              <button v-if="isZoomed" type="button" class="cursor-pointer rounded border border-border-default bg-background-subtle px-2 py-0.5 text-[11px] hover:bg-background-muted" @click="resetZoom">Reset</button>
              <span class="ml-1 font-mono text-[11px]">{{ zoomRange[0] + 1 }}–{{ zoomRange[1] }}/{{ multiRows.length }}</span>
            </div>
            <span class="text-[11px] text-foreground-muted">Crosshair + Scroll Zoom + Centered SVG Dot</span>
          </div>

          <div
            class="relative rounded-xl border border-border-subtle bg-background-subtle/50 p-4"
            @wheel.prevent="onWheelZoom($event)"
            @mouseleave="activeSvgIdx = -1"
          >
            <div class="mb-2 flex items-center justify-between text-xs text-foreground-muted">
              <span>SVG Custom via <code>scaleLinear</code> + <code>scaleBand</code> + <code>getSmoothBezierPath</code></span>
              <span v-if="activeSvgPoint" class="font-semibold text-foreground-default">{{ activeSvgPoint.label }}: {{ activeSvgPoint.value }}</span>
            </div>

            <div class="relative">
              <!-- Floating HTML Tooltip positioned over active SVG dot -->
              <div
                v-if="svgTooltip.open"
                role="tooltip"
                class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-primary-default px-2.5 py-1 text-xs font-medium whitespace-nowrap text-primary-foreground shadow-md transition-all duration-100"
                :style="{ left: svgTooltip.left, top: svgTooltip.top }"
              >
                {{ svgTooltip.text }}
              </div>

              <svg
                viewBox="0 0 360 150"
                class="h-52 w-full overflow-visible select-none"
                @mousemove="onSvgMouseMove"
              >
                <line
                  v-for="tick in svgData.ticks"
                  :key="tick"
                  x1="28"
                  x2="352"
                  :y1="svgData.yScale(tick)"
                  :y2="svgData.yScale(tick)"
                  class="stroke-border-default"
                  stroke-dasharray="3 3"
                />
                <text
                  v-for="tick in svgData.ticks"
                  :key="'t-' + tick"
                  x="22"
                  :y="svgData.yScale(tick) + 4"
                  text-anchor="end"
                  class="fill-foreground-muted text-[10px]"
                >
                  {{ tick }}
                </text>
                <line
                  v-if="activeSvgPoint"
                  :x1="activeSvgPoint.x"
                  :x2="activeSvgPoint.x"
                  y1="14"
                  y2="125"
                  class="stroke-primary-default/40"
                  stroke-width="1"
                  stroke-dasharray="3 3"
                />
                <path :d="svgData.areaPath" class="fill-chart-series-1/15 transition-all duration-300" />
                <path :d="svgData.linePath" fill="none" stroke-width="2.5" class="stroke-chart-series-1 transition-all duration-300" />
                <g v-for="(pt, idx) in svgData.points" :key="pt.label">
                  <circle
                    :cx="pt.x"
                    :cy="pt.y"
                    r="5"
                    class="pointer-events-none origin-center fill-background-default stroke-chart-series-1 transition-transform duration-150 [transform-box:fill-box]"
                    :class="activeSvgIdx === idx ? 'scale-125' : 'scale-100'"
                    stroke-width="2.5"
                  />
                  <circle
                    :cx="pt.x"
                    :cy="pt.y"
                    r="12"
                    fill="transparent"
                    class="cursor-pointer"
                    @mouseenter="activeSvgIdx = idx"
                  />
                  <text :x="pt.x" y="144" text-anchor="middle" class="fill-foreground-muted text-[10px]">
                    {{ pt.label }}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </template>

        <!-- TAB 3: Headless Donut SVG -->
        <template v-else>
          <div class="relative flex flex-wrap items-center justify-center gap-8 rounded-xl border border-border-subtle bg-background-subtle/50 p-6">
            <div class="relative flex items-center justify-center" @mouseleave="hoveredPieSlice = null">
              <div
                v-if="hoveredPieSlice"
                class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-primary-default px-2.5 py-1 text-xs font-medium whitespace-nowrap text-primary-foreground shadow-md transition-all duration-100"
                :style="{ left: hoveredPieSlice.left, top: `calc(${hoveredPieSlice.top} - 8px)` }"
              >
                {{ hoveredPieSlice.tooltipText }}
              </div>
              <svg viewBox="0 0 100 100" class="h-44 w-44 -rotate-90">
                <circle
                  v-for="slice in pieState.slices"
                  :key="slice.label"
                  cx="50"
                  cy="50"
                  :r="pieState.ringRadius"
                  fill="none"
                  :stroke-width="pieState.ringWidth"
                  :stroke-dasharray="slice.dashArray"
                  :stroke-dashoffset="slice.dashOffset"
                  :class="[slice.strokeClass, hoveredPieSlice?.label === slice.label ? 'opacity-100' : hoveredPieSlice ? 'opacity-60' : 'opacity-100']"
                  class="cursor-pointer transition-opacity duration-200"
                  @mouseenter="hoveredPieSlice = slice"
                />
              </svg>
              <div class="pointer-events-none absolute text-center">
                <div class="text-lg font-bold">{{ pieState.total }}</div>
                <div class="text-[11px] text-foreground-muted">Total</div>
              </div>
            </div>
            <ul class="min-w-[160px] space-y-2 text-xs">
              <li v-for="(s, idx) in pieState.slices" :key="s.label" class="flex items-center justify-between gap-4">
                <span class="flex items-center gap-2 font-medium">
                  <span class="h-2.5 w-2.5 rounded-full" :class="SERIES_COLORS[idx]"></span>
                  {{ s.label }}
                </span>
                <span class="text-foreground-muted">{{ s.value }} ({{ s.percentage }}%)</span>
              </li>
            </ul>
          </div>
        </template>
      </div>

      <!-- Right: Live Headless State Inspector -->
      <div class="flex flex-col gap-2 rounded-xl border border-border-default bg-background-subtle p-4 lg:col-span-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-foreground-default">Live Headless Engine Output</span>
          <span class="rounded bg-background-muted px-2 py-0.5 font-mono text-[10px] text-foreground-muted">0% DOM / CSS</span>
        </div>
        <pre class="max-h-56 overflow-auto rounded-lg bg-background-default p-3 font-mono text-[11px] leading-relaxed text-foreground-subtle">{{ inspectorJson }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  computeNiceTicks,
  getAreaPath,
  getChartBarState,
  getChartPieState,
  getChartTooltipAnchor,
  getNearestPointIndex,
  getSmoothBezierPath,
  getSvgTooltipAnchor,
  muteSeriesValues,
  panZoomRange,
  scaleBand,
  scaleLinear,
  sliceChartWindow,
  toggleListItem,
  zoomRangeAt,
  type ChartTooltipAnchor,
  type ChartZoomRange,
} from '../preview/utils';

const SERIES_NAMES = ['Direct', 'Marketplace', 'Affiliate'];
const SERIES_COLORS = ['bg-chart-series-1', 'bg-chart-series-2', 'bg-chart-series-3'];

const tabs = [
  { id: 'bar' as const, label: 'Bar + Legend' },
  { id: 'svg' as const, label: 'SVG Bezier' },
  { id: 'pie' as const, label: 'Donut SVG' },
];

const activeTab = ref<'bar' | 'svg' | 'pie'>('bar');
const stacked = ref(true);
const mutedSeries = ref<number[]>([]);
const barChartRef = ref<HTMLElement | null>(null);
const barTooltip = ref<ChartTooltipAnchor>({ open: false, text: '', x: 0, y: 0, left: '0px', top: '0px' });
const hoveredPieSlice = ref<{ label: string; tooltipText: string; left: string; top: string } | null>(null);
const activeSvgIdx = ref(-1);

function showBarTooltip(text: string, event: MouseEvent) {
  barTooltip.value = getChartTooltipAnchor(text, event.currentTarget as HTMLElement, barChartRef.value, 8);
}

const multiRows = ref([
  { label: 'Sen', values: [45, 32, 18] },
  { label: 'Sel', values: [72, 40, 24] },
  { label: 'Rab', values: [58, 52, 35] },
  { label: 'Kam', values: [88, 46, 28] },
  { label: 'Jum', values: [64, 58, 42] },
  { label: 'Sab', values: [76, 48, 30] },
  { label: 'Min', values: [52, 36, 22] },
  { label: 'W2-S', values: [91, 54, 38] },
  { label: 'W2-R', values: [68, 44, 29] },
]);

const zoomRange = ref<ChartZoomRange>([0, multiRows.value.length]);
const isZoomed = computed(() => zoomRange.value[0] > 0 || zoomRange.value[1] < multiRows.value.length);

function zoomIn() {
  zoomRange.value = zoomRangeAt(zoomRange.value, 0.7, 0.5, multiRows.value.length, 3);
}
function zoomOut() {
  zoomRange.value = zoomRangeAt(zoomRange.value, 1.4, 0.5, multiRows.value.length, 3);
}
function panLeft() {
  zoomRange.value = panZoomRange(zoomRange.value, -1, multiRows.value.length, 3);
}
function panRight() {
  zoomRange.value = panZoomRange(zoomRange.value, 1, multiRows.value.length, 3);
}
function resetZoom() {
  zoomRange.value = [0, multiRows.value.length];
}
function onWheelZoom(e: WheelEvent) {
  const el = e.currentTarget as HTMLElement | null;
  const rect = el?.getBoundingClientRect();
  const anchor = rect && rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0.5;
  zoomRange.value = zoomRangeAt(zoomRange.value, e.deltaY < 0 ? 0.8 : 1.25, anchor, multiRows.value.length, 3);
}

function onSvgMouseMove(e: MouseEvent) {
  const el = e.currentTarget as SVGSVGElement | null;
  const rect = el?.getBoundingClientRect();
  if (!rect || rect.width <= 0) return;
  const ratio = (e.clientX - rect.left) / rect.width;
  activeSvgIdx.value = getNearestPointIndex(ratio, svgData.value.points.length);
}

function toggleSeries(idx: number) {
  mutedSeries.value = toggleListItem(mutedSeries.value, idx);
}

function randomizeData() {
  multiRows.value = multiRows.value.map((row) => ({
    label: row.label,
    values: row.values.map(() => Math.floor(15 + Math.random() * 80)),
  }));
}

const activeMulti = computed(() => sliceChartWindow(muteSeriesValues(multiRows.value, mutedSeries.value), zoomRange.value));

const nice = computed(() => {
  const totals = activeMulti.value.map((r) =>
    stacked.value ? r.values.reduce((a, b) => a + b, 0) : Math.max(...r.values)
  );
  return computeNiceTicks(Math.max(20, ...totals), 5);
});

const barState = computed(() =>
  getChartBarState(activeMulti.value, 'bg-chart-series-1', stacked.value, nice.value.max)
);

const svgData = computed(() => {
  const flat = sliceChartWindow(multiRows.value, zoomRange.value).map((r) => ({
    label: r.label,
    value: r.values.reduce((a, b) => a + b, 0),
  }));
  const yNice = computeNiceTicks(Math.max(50, ...flat.map((d) => d.value)), 4);
  const yScale = scaleLinear({ domain: [0, yNice.max], range: [125, 14] });
  const xScale = scaleBand({ domain: flat.map((d) => d.label), range: [36, 344], padding: 0.25 });
  const points = flat.map((d) => ({
    label: d.label,
    value: d.value,
    x: Number((xScale(d.label) + xScale.bandwidth / 2).toFixed(1)),
    y: Number(yScale(d.value).toFixed(1)),
  }));
  return {
    ticks: yNice.ticks,
    yScale,
    points,
    linePath: getSmoothBezierPath(points),
    areaPath: getAreaPath(points, 125),
  };
});

const activeSvgPoint = computed(() =>
  activeSvgIdx.value >= 0 && activeSvgIdx.value < svgData.value.points.length
    ? svgData.value.points[activeSvgIdx.value]
    : null
);

const svgTooltip = computed<ChartTooltipAnchor>(() =>
  activeSvgPoint.value
    ? getSvgTooltipAnchor(`${activeSvgPoint.value.label}: ${activeSvgPoint.value.value}`, activeSvgPoint.value.x, activeSvgPoint.value.y, 360, 150, 12)
    : { open: false, text: '', x: 0, y: 0, left: '0px', top: '0px' }
);

const pieState = computed(() => {
  const totals = SERIES_NAMES.map((name, idx) => ({
    label: name,
    value: multiRows.value.reduce((acc, r) => acc + (r.values[idx] ?? 0), 0),
  }));
  return getChartPieState(totals, 28);
});

const inspectorJson = computed(() => {
  if (activeTab.value === 'bar') {
    return JSON.stringify(
      {
        mutedSeries: mutedSeries.value,
        niceTicks: nice.value,
        firstRow: barState.value.rows[0],
      },
      null,
      2
    );
  }
  if (activeTab.value === 'svg') {
    return JSON.stringify(
      {
        ticks: svgData.value.ticks,
        linePath: svgData.value.linePath,
        points: svgData.value.points,
      },
      null,
      2
    );
  }
  return JSON.stringify(
    {
      total: pieState.value.total,
      ringRadius: pieState.value.ringRadius,
      slices: pieState.value.slices.map((s) => ({
        label: s.label,
        percentage: s.percentage,
        dashArray: s.dashArray,
        dashOffset: s.dashOffset,
      })),
    },
    null,
    2
  );
});
</script>
