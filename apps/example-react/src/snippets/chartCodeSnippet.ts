export type ChartMode =
  | 'bar' | 'grouped-bar' | 'stacked-bar' | 'line' | 'area' | 'pie'
  | 'donut' | 'hbar' | 'scatter' | 'radar' | 'gauge' | 'funnel' | 'waterfall';

export type ValueFormatPreset = 'paket' | 'rupiah' | 'persen';
export type TooltipPos = 'top' | 'bottom' | 'left' | 'right';

export interface ChartSnippetOptions {
  chartMode: ChartMode;
  tooltipPosition: TooltipPos;
  formatPreset: ValueFormatPreset;
  showDataLabels: boolean;
  showGridLines: boolean;
  showTooltip: boolean;
  mutedSeries: number[];
}

const CHART_COMP_MAP: Record<ChartMode, string> = {
  bar: 'ChartBar', 'grouped-bar': 'ChartBar', 'stacked-bar': 'ChartBar',
  line: 'ChartLine', area: 'ChartLine', pie: 'ChartPie', donut: 'ChartPie',
  hbar: 'ChartHorizontalBar', scatter: 'ChartScatter', radar: 'ChartRadar',
  gauge: 'ChartGauge', funnel: 'ChartFunnel', waterfall: 'ChartWaterfall',
};

function buildActiveChartJsx(o: ChartSnippetOptions): string {
  const s = `showDataLabels={${o.showDataLabels}} showTooltip={${o.showTooltip}} tooltipPosition="${o.tooltipPosition}" formatValue={formatValue} formatTooltip={formatTooltip}`;
  const g = `yTicks={niceTicks.ticks} maxValue={niceTicks.max} showGridLines={${o.showGridLines}} ${s}`;
  switch (o.chartMode) {
    case 'bar': return `<ChartBar data={singleData} ${g} />`;
    case 'grouped-bar': return `<ChartBar data={activeMultiData} ${g} />`;
    case 'stacked-bar': return `<ChartBar data={activeMultiData} stacked ${g} />`;
    case 'line': return `<ChartLine data={singleData} ${g} />`;
    case 'area': return `<ChartLine data={singleData} area ${g} />`;
    case 'pie': return `<ChartPie data={activeSliceData} ${s} />`;
    case 'donut': return `<ChartPie data={activeSliceData} innerRadius={28} ${s} />`;
    case 'hbar': return `<ChartHorizontalBar data={singleData} maxValue={niceTicks.max} ${s} />`;
    case 'scatter': return `<ChartScatter data={activeScatter} yTicks={niceTicks.ticks} maxY={niceTicks.max} showGridLines={${o.showGridLines}} ${s} />`;
    case 'radar': return `<ChartRadar data={activeMultiData} maxValue={120} showTooltip={${o.showTooltip}} tooltipPosition="${o.tooltipPosition}" formatValue={formatValue} formatTooltip={formatTooltip} />`;
    case 'gauge': return `<ChartGauge value={86} min={0} max={100} ${s} />`;
    case 'funnel': return `<ChartFunnel data={activeSliceData} ${s} />`;
    case 'waterfall': return `<ChartWaterfall data={waterfallData} ${g} />`;
  }
}

function buildSnippetHeader(comp: string): string {
  return [
    `import React, { useState } from 'react';`,
    `import {`,
    `  Chart, ${comp}, ChartLegend, ChartLegendItem,`,
    `  toggleListItem, muteSeriesValues, filterActiveSeries, computeNiceTicks,`,
    `} from '@komerce-design/react';`,
    ``,
    `const MULTI_DATA = [`,
    `  { label: 'Sen', value: 64, values: [64, 42, 28] },`,
    `  { label: 'Sel', value: 82, values: [82, 54, 34] },`,
    `  { label: 'Rab', value: 75, values: [75, 48, 31] },`,
    `  { label: 'Kam', value: 94, values: [94, 62, 40] },`,
    `  { label: 'Jum', value: 118, values: [118, 76, 49] },`,
    `];`,
    `const SCATTER_DATA = [`,
    `  { label: 'JKT', x: 22, y: 88, series: 0 }, { label: 'BDG', x: 48, y: 68, series: 1 },`,
    `  { label: 'SBY', x: 76, y: 94, series: 0 }, { label: 'MDN', x: 62, y: 52, series: 2 },`,
    `];`,
    `const SERIES_META = [`,
    `  { label: 'Reguler (Series 1)', colorClass: 'bg-chart-series-1' },`,
    `  { label: 'Next Day (Series 2)', colorClass: 'bg-chart-series-2' },`,
    `  { label: 'Cargo (Series 3)', colorClass: 'bg-chart-series-3' },`,
    `];`,
  ].join('\n');
}

export function buildChartCodeSnippet(opts: ChartSnippetOptions): string {
  const fmtBody = opts.formatPreset === 'rupiah' ? '`Rp ${v} Jt`' : opts.formatPreset === 'persen' ? '`${v}%`' : '`${v}K paket`';
  const header = buildSnippetHeader(CHART_COMP_MAP[opts.chartMode]);
  const chartJsx = buildActiveChartJsx(opts);
  const body = [
    `export function ShipmentAnalyticsChart() {`,
    `  const [mutedSeries, setMutedSeries] = useState<number[]>(${JSON.stringify(opts.mutedSeries)});`,
    `  const singleData = MULTI_DATA.map(({ label, value }) => ({ label, value }));`,
    `  const activeMultiData = muteSeriesValues(MULTI_DATA, mutedSeries);`,
    `  const activeSliceData = muteSeriesValues(singleData.slice(0, 3), mutedSeries);`,
    `  const activeScatter = filterActiveSeries(SCATTER_DATA, mutedSeries);`,
    `  const waterfallData = [{ label: 'GMV', value: 120 }, { label: 'Diskon', value: -25 }, { label: 'Net', value: 95, isTotal: true }];`,
    `  const peakVal = Math.max(100, ...activeMultiData.flatMap((d) => d.values ?? [d.value]));`,
    `  const niceTicks = computeNiceTicks(peakVal, 5);`,
    `  const formatValue = (v: number) => ${fmtBody};`,
    `  const formatTooltip = (ctx: { label: string; value: number }) => \`\${ctx.label}: \${formatValue(ctx.value)}\`;`,
    ``,
    `  return (`,
    `    <Chart title="Analitik Pengiriman (${opts.chartMode})" description="Klik item legenda untuk mute/unmute seri secara live.">`,
    `      ${chartJsx}`,
    `      <ChartLegend className="mt-4">`,
    `        {SERIES_META.map((s, idx) => (`,
    `          <ChartLegendItem key={s.label} interactive active={!mutedSeries.includes(idx)} colorClass={s.colorClass}`,
    `            onClick={() => setMutedSeries((prev) => toggleListItem(prev, idx))}>{s.label}</ChartLegendItem>`,
    `        ))}`,
    `      </ChartLegend>`,
    `    </Chart>`,
    `  );`,
    `}`,
  ].join('\n');
  return `${header}\n\n${body}`;
}
