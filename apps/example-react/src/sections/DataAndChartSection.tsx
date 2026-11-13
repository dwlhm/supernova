import React, { useState } from 'react';
import {
  Badge, Button, Card, CardFooter, CardHeader, Chart, ChartBar, ChartFunnel,
  ChartGauge, ChartHorizontalBar, ChartLegend, ChartLegendItem, ChartLine,
  ChartPie, ChartRadar, ChartScatter, ChartWaterfall, Divider, ListItem,
  Progressbar, Stat, SwitchButton,
  computeNiceTicks, filterActiveSeries, getChartBarState, getChartLineState,
  getChartPieState, getSmoothBezierPath, muteSeriesValues, scaleBand,
  scaleLinear, toggleListItem,
} from '@komerce-design/react';
import { CodeShowcaseCard } from '../components/CodeShowcaseCard';
import {
  buildChartCodeSnippet, type ChartMode, type TooltipPos, type ValueFormatPreset,
} from '../snippets/chartCodeSnippet';

const MULTI_SERIES_DATA = [
  { label: 'Sen', value: 64, values: [64, 42, 28] },
  { label: 'Sel', value: 82, values: [82, 54, 34] },
  { label: 'Rab', value: 75, values: [75, 48, 31] },
  { label: 'Kam', value: 94, values: [94, 62, 40] },
  { label: 'Jum', value: 118, values: [118, 76, 49] },
  { label: 'Sab', value: 105, values: [105, 68, 44] },
];

const SCATTER_DATA = [
  { label: 'JKT-1', x: 20, y: 82, series: 0 }, { label: 'SBY-1', x: 75, y: 92, series: 0 },
  { label: 'BDG-2', x: 45, y: 68, series: 1 }, { label: 'SMG-2', x: 58, y: 74, series: 1 },
  { label: 'MDN-3', x: 62, y: 48, series: 2 }, { label: 'MKS-3', x: 84, y: 56, series: 2 },
];

const WATERFALL_DATA = [
  { label: 'GMV Kotor', value: 120 }, { label: 'Diskon Ongkir', value: -25 },
  { label: 'Retur COD', value: -15 }, { label: 'Asuransi', value: 18 },
  { label: 'Net Revenue', value: 98, isTotal: true },
];

const SERIES_META = [
  { label: 'Reguler (Series 1)', colorClass: 'bg-chart-series-1' },
  { label: 'Instant / Next Day (Series 2)', colorClass: 'bg-chart-series-2' },
  { label: 'Cargo (Series 3)', colorClass: 'bg-chart-series-3' },
];

const CHART_MODES: Array<{ id: ChartMode; label: string }> = [
  { id: 'bar', label: 'Bar' }, { id: 'grouped-bar', label: 'Grouped Bar' },
  { id: 'stacked-bar', label: 'Stacked Bar' }, { id: 'line', label: 'Line' },
  { id: 'area', label: 'Area' }, { id: 'pie', label: 'Pie' },
  { id: 'donut', label: 'Donut' }, { id: 'hbar', label: 'Horizontal Bar' },
  { id: 'scatter', label: 'Scatter' }, { id: 'radar', label: 'Radar' },
  { id: 'gauge', label: 'Gauge' }, { id: 'funnel', label: 'Funnel' },
  { id: 'waterfall', label: 'Waterfall' },
];

function KpiMetricsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader title="Total GMV Pengiriman" />
        <Stat value="Rp 1,48 Miliar" size="lg" />
        <div className="flex flex-row items-center gap-3">
          <Stat label="Minggu Ini" value="Rp 1,48M" reversed />
          <Divider orientation="vertical" className="h-9" />
          <Stat label="Minggu Lalu" value="Rp 1,25M" reversed muted />
        </div>
        <CardFooter>
          <Badge variant="success">↑ +18.4%</Badge>
          <span className="text-xs text-foreground-muted">Dibandingkan minggu lalu</span>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader title="Distribusi Ekspedisi Teratas">
          <Badge variant="secondary">Real-time SLA</Badge>
        </CardHeader>
        <Stat value="538.200 Paket" size="lg" />
        <ChartHorizontalBar
          stacked
          data={[{ label: 'SiCepat', value: 44 }, { label: 'JNE', value: 32 }, { label: 'J&T', value: 24 }]}
          barClassName="h-2"
        />
        <div className="flex flex-col gap-2 mt-1">
          <ListItem badge="#1" dotTone="series-1" value="44%">SiCepat BEST</ListItem>
          <ListItem badge="#2" dotTone="series-2" value="32%">JNE Reguler</ListItem>
          <ListItem badge="#3" dotTone="series-3" value="24%">J&amp;T Express</ListItem>
        </div>
      </Card>
      <Card>
        <CardHeader title="Pencapaian SLA Pengiriman">
          <Badge variant="success">↑ +2.1%</Badge>
        </CardHeader>
        <Stat value="94,2%" size="lg" />
        <div className="flex flex-col gap-3.5 mt-1">
          <Progressbar value={94} showLabel showPercentage={false} label={(pct) => `Target Kuartal Q4: ${pct}% Tercapai`} indicatorClassName="bg-chart-series-1" />
          <Progressbar value={88} showLabel label={(pct) => `Kapasitas Gudang Hub Utama (${pct}%)`} />
        </div>
      </Card>
    </div>
  );
}

interface StudioControlsProps {
  tooltipPosition: TooltipPos; onTooltipPositionChange: (p: TooltipPos) => void;
  formatPreset: ValueFormatPreset; onFormatPresetChange: (f: ValueFormatPreset) => void;
  showDataLabels: boolean; onShowDataLabelsChange: (v: boolean) => void;
  showGridLines: boolean; onShowGridLinesChange: (v: boolean) => void;
  showTooltip: boolean; onShowTooltipChange: (v: boolean) => void;
}

function ChartStudioControlsBar(props: StudioControlsProps) {
  return (
    <div className="rounded-xl border border-border-default bg-background-subtle p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground-muted">Tooltip:</span>
          {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
            <Button key={pos} size="mini" variant={props.tooltipPosition === pos ? 'secondary' : 'ghost'} onClick={() => props.onTooltipPositionChange(pos)}>{pos}</Button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground-muted">Format:</span>
          {([['paket', 'K Paket'], ['rupiah', 'Rp Juta'], ['persen', 'Persen %']] as const).map(([id, lbl]) => (
            <Button key={id} size="mini" variant={props.formatPreset === id ? 'secondary' : 'ghost'} onClick={() => props.onFormatPresetChange(id)}>{lbl}</Button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <SwitchButton id="sw-labels" size="small" checked={props.showDataLabels} onCheckedChange={props.onShowDataLabelsChange}>Data Labels</SwitchButton>
        <SwitchButton id="sw-grid" size="small" checked={props.showGridLines} onCheckedChange={props.onShowGridLinesChange}>Grid Lines</SwitchButton>
        <SwitchButton id="sw-tip" size="small" checked={props.showTooltip} onCheckedChange={props.onShowTooltipChange}>Tooltip</SwitchButton>
      </div>
    </div>
  );
}

function ActiveChartCanvas(props: {
  mode: ChartMode; tooltipPosition: TooltipPos; formatPreset: ValueFormatPreset;
  showDataLabels: boolean; showGridLines: boolean; showTooltip: boolean; mutedSeries: number[];
}) {
  const formatValue = (v: number) => (props.formatPreset === 'rupiah' ? `Rp ${v} Jt` : props.formatPreset === 'persen' ? `${v}%` : `${v}K paket`);
  const formatTooltip = (ctx: { label: string; value: number }) => `${ctx.label}: ${formatValue(ctx.value)}`;
  const singleData = MULTI_SERIES_DATA.map(({ label, value }) => ({ label, value }));
  const multiData = muteSeriesValues(MULTI_SERIES_DATA, props.mutedSeries);
  const sliceData = muteSeriesValues(singleData.slice(0, 3), props.mutedSeries);
  const scatterData = filterActiveSeries(SCATTER_DATA, props.mutedSeries);
  const rawMax = props.mode === 'stacked-bar'
    ? Math.max(100, ...multiData.map((d) => (d.values ?? []).reduce((a, b) => a + b, 0)))
    : Math.max(100, ...multiData.flatMap((d) => d.values ?? [d.value]));
  const nice = computeNiceTicks(rawMax, 5);
  const shared = { showDataLabels: props.showDataLabels, showTooltip: props.showTooltip, tooltipPosition: props.tooltipPosition, formatValue, formatTooltip };

  switch (props.mode) {
    case 'bar': return <ChartBar data={singleData} yTicks={nice.ticks} maxValue={nice.max} showGridLines={props.showGridLines} {...shared} />;
    case 'grouped-bar': return <ChartBar data={multiData} yTicks={nice.ticks} maxValue={nice.max} showGridLines={props.showGridLines} {...shared} />;
    case 'stacked-bar': return <ChartBar data={multiData} stacked yTicks={nice.ticks} maxValue={nice.max} showGridLines={props.showGridLines} {...shared} />;
    case 'line': return <ChartLine data={singleData} yTicks={nice.ticks} maxValue={nice.max} showGridLines={props.showGridLines} {...shared} />;
    case 'area': return <ChartLine data={singleData} area yTicks={nice.ticks} maxValue={nice.max} showGridLines={props.showGridLines} {...shared} />;
    case 'pie': return <ChartPie data={sliceData} {...shared} />;
    case 'donut': return <ChartPie data={sliceData} innerRadius={28} {...shared} />;
    case 'hbar': return <ChartHorizontalBar data={singleData.slice(0, 5)} maxValue={nice.max} {...shared} />;
    case 'scatter': return <ChartScatter data={scatterData} yTicks={nice.ticks} maxY={nice.max} showGridLines={props.showGridLines} {...shared} />;
    case 'radar': return <ChartRadar data={multiData.slice(0, 5)} maxValue={120} showTooltip={props.showTooltip} tooltipPosition={props.tooltipPosition} formatValue={formatValue} formatTooltip={formatTooltip} />;
    case 'gauge': return <ChartGauge value={86} min={0} max={100} {...shared} />;
    case 'funnel': return <ChartFunnel data={sliceData} {...shared} />;
    case 'waterfall': return <ChartWaterfall data={WATERFALL_DATA} yTicks={computeNiceTicks(140, 5).ticks} maxValue={140} showGridLines={props.showGridLines} {...shared} />;
  }
}

function GeometryReadoutPanel(props: { mutedSeries: number[] }) {
  const activeMulti = muteSeriesValues(MULTI_SERIES_DATA, props.mutedSeries);
  const singleData = MULTI_SERIES_DATA.map(({ label, value }) => ({ label, value }));
  const nice = computeNiceTicks(Math.max(100, ...activeMulti.flatMap((d) => d.values ?? [d.value])), 5);
  const barState = getChartBarState(activeMulti);
  const lineState = getChartLineState(singleData);
  const pieState = getChartPieState(muteSeriesValues(singleData.slice(0, 3), props.mutedSeries), 28);
  const linearScale = scaleLinear({ domain: [0, nice.max], range: [0, 100] });
  const bandScale = scaleBand({ domain: singleData.map((d) => d.label), range: [0, 300], padding: 0.2 });
  const bezier = getSmoothBezierPath([{ x: 0, y: 80 }, { x: 50, y: 30 }, { x: 100, y: 45 }]);

  return (
    <pre className="max-h-60 overflow-auto rounded-xl border border-border-default bg-background-default p-4 font-mono text-xs leading-relaxed">
      {JSON.stringify({
        computeNiceTicks: nice, 'scaleLinear(90)': Number(linearScale(90).toFixed(2)),
        'scaleBand.bandwidth': Number(bandScale.bandwidth.toFixed(2)), getSmoothBezierPath: bezier,
        barRowsCount: barState.rows.length, linePointsCount: lineState.points.length, pieActiveTotal: pieState.displayTotal,
      }, null, 2)}
    </pre>
  );
}

function StudioHeaderBar(props: { showGeometry: boolean; onToggleGeometry: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-default pb-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">13 Interactive Modes</Badge>
          <Badge variant="outline">Open Legend SRP</Badge>
          <h2 className="text-lg font-bold text-foreground-default">Interactive Chart Studio &amp; Series Muting</h2>
        </div>
        <p className="mt-1 text-xs text-foreground-muted">
          Pilih varian grafik, atur format nilai/tooltip, dan klik `ChartLegendItem` untuk memfilter seri via `toggleListItem` + `muteSeriesValues`.
        </p>
      </div>
      <Button size="small" variant="outline" onClick={props.onToggleGeometry}>
        {props.showGeometry ? 'Sembunyikan Headless Math' : 'Inspeksi Headless Geometry'}
      </Button>
    </div>
  );
}

export function DataAndChartSection() {
  const [studio, setStudio] = useState({
    chartMode: 'grouped-bar' as ChartMode, tooltipPosition: 'top' as TooltipPos, formatPreset: 'paket' as ValueFormatPreset,
    showDataLabels: true, showGridLines: true, showTooltip: true, mutedSeries: [] as number[], showGeometry: false,
  });
  const activeLabel = CHART_MODES.find((m) => m.id === studio.chartMode)?.label;
  const snippet = buildChartCodeSnippet(studio);

  return (
    <section className="flex flex-col gap-8">
      <KpiMetricsRow />
      <div className="rounded-2xl border border-border-default bg-background-default p-6 lg:p-7 shadow-xs flex flex-col gap-6">
        <StudioHeaderBar showGeometry={studio.showGeometry} onToggleGeometry={() => setStudio((s) => ({ ...s, showGeometry: !s.showGeometry }))} />
        <div className="flex flex-wrap gap-2">
          {CHART_MODES.map((m) => <Button key={m.id} size="small" variant={studio.chartMode === m.id ? 'primary' : 'outline'} onClick={() => setStudio((s) => ({ ...s, chartMode: m.id }))}>{m.label}</Button>)}
        </div>
        <ChartStudioControlsBar
          tooltipPosition={studio.tooltipPosition} onTooltipPositionChange={(tooltipPosition) => setStudio((s) => ({ ...s, tooltipPosition }))}
          formatPreset={studio.formatPreset} onFormatPresetChange={(formatPreset) => setStudio((s) => ({ ...s, formatPreset }))}
          showDataLabels={studio.showDataLabels} onShowDataLabelsChange={(showDataLabels) => setStudio((s) => ({ ...s, showDataLabels }))}
          showGridLines={studio.showGridLines} onShowGridLinesChange={(showGridLines) => setStudio((s) => ({ ...s, showGridLines }))}
          showTooltip={studio.showTooltip} onShowTooltipChange={(showTooltip) => setStudio((s) => ({ ...s, showTooltip }))}
        />
        <Chart title={`Visualisasi Aktif: ${activeLabel}`} description="Klik legenda di bawah untuk menyembunyikan/menampilkan seri secara interaktif; sumbu Y dihitung otomatis via computeNiceTicks().">
          <div className="py-3"><ActiveChartCanvas mode={studio.chartMode} tooltipPosition={studio.tooltipPosition} formatPreset={studio.formatPreset} showDataLabels={studio.showDataLabels} showGridLines={studio.showGridLines} showTooltip={studio.showTooltip} mutedSeries={studio.mutedSeries} /></div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
            <ChartLegend>{SERIES_META.map((serie, idx) => <ChartLegendItem key={serie.label} interactive active={!studio.mutedSeries.includes(idx)} colorClass={serie.colorClass} onClick={() => setStudio((s) => ({ ...s, mutedSeries: toggleListItem(s.mutedSeries, idx) }))}>{serie.label}</ChartLegendItem>)}</ChartLegend>
            {studio.mutedSeries.length > 0 && <Button size="mini" variant="ghost" onClick={() => setStudio((s) => ({ ...s, mutedSeries: [] }))}>Reset Seri ({studio.mutedSeries.length} tersembunyi)</Button>}
          </div>
        </Chart>
        {studio.showGeometry && <GeometryReadoutPanel mutedSeries={studio.mutedSeries} />}
      </div>
      <CodeShowcaseCard title="Composable Chart + Interactive Legend Recipe" description="Kode React siap pakai yang menggabungkan komponen <Chart*> terbuka dengan pure SRP helpers." helpers={['toggleListItem()', 'muteSeriesValues()', 'filterActiveSeries()', 'computeNiceTicks()']} code={snippet} />
    </section>
  );
}
