import { useStore, For, Show } from '@builder.io/mitosis';
import { cn } from '../components/utils';
import Chart from '../components/Chart.lite';
import ChartBar from '../components/ChartBar.lite';
import ChartLine from '../components/ChartLine.lite';
import ChartPie from '../components/ChartPie.lite';
import ChartHorizontalBar from '../components/ChartHorizontalBar.lite';
import ChartScatter from '../components/ChartScatter.lite';
import ChartRadar from '../components/ChartRadar.lite';
import ChartGauge from '../components/ChartGauge.lite';
import ChartFunnel from '../components/ChartFunnel.lite';
import ChartWaterfall from '../components/ChartWaterfall.lite';
import ChartLegend from '../components/ChartLegend.lite';
import ChartLegendItem from '../components/ChartLegendItem.lite';

export default function ChartExample() {
  const state = useStore({
    activeType: 'bar',
    chartTypes: [
      { id: 'bar', label: 'Bar' }, { id: 'line', label: 'Line' }, { id: 'area', label: 'Area' },
      { id: 'donut', label: 'Donut' }, { id: 'pie', label: 'Pie' }, { id: 'stacked-bar', label: 'Stacked Bar' },
      { id: 'horizontal-bar', label: 'Horizontal Bar' }, { id: 'scatter', label: 'Scatter' }, { id: 'radar', label: 'Radar' },
      { id: 'gauge', label: 'Gauge' }, { id: 'funnel', label: 'Funnel' }, { id: 'waterfall', label: 'Waterfall' },
    ],
  });

  return (
    <div class="flex w-full flex-col gap-4">
      <div class="flex flex-wrap items-center gap-1.5">
        <For each={state.chartTypes}>
          {(t) => (
            <button
              key={t.id} type="button" onClick={() => { state.activeType = t.id; }}
              class={cn('cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors', state.activeType === t.id ? 'border-primary-default bg-primary-default text-primary-foreground' : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default')}
            >{t.label}</button>
          )}
        </For>
      </div>
      <Chart title="Revenue Overview" description="Weekly revenue breakdown by day">
        <Show when={state.activeType === 'bar'}>
          <ChartBar yTicks={[200, 150, 100, 50, 0]} maxValue={200} data={[{ label: 'Mon', value: 120 }, { label: 'Tue', value: 80 }, { label: 'Wed', value: 165 }, { label: 'Thu', value: 25 }, { label: 'Fri', value: 145 }, { label: 'Sat', value: 60 }, { label: 'Sun', value: 135 }]} />
        </Show>
        <Show when={state.activeType === 'line' || state.activeType === 'area'}>
          <ChartLine yTicks={[200, 150, 100, 50, 0]} maxValue={200} area={state.activeType === 'area'} showDataLabels={true} data={[{ label: 'Mon', value: 120 }, { label: 'Tue', value: 80 }, { label: 'Wed', value: 160 }, { label: 'Thu', value: 100 }, { label: 'Fri', value: 140 }, { label: 'Sat', value: 60 }, { label: 'Sun', value: 130 }]} />
        </Show>
        <Show when={state.activeType === 'donut' || state.activeType === 'pie'}>
          <ChartPie innerRadius={state.activeType === 'donut' ? 30 : 0} centerLabel="45.2K" data={[{ label: 'Series 1', value: 30 }, { label: 'Series 2', value: 24 }, { label: 'Series 3', value: 18 }, { label: 'Series 4', value: 15 }, { label: 'Series 5', value: 13 }]} />
        </Show>
        <Show when={state.activeType === 'stacked-bar'}>
          <ChartBar yTicks={[200, 150, 100, 50, 0]} maxValue={200} stacked={true} data={[{ label: 'Mon', values: [50, 35, 35] }, { label: 'Tue', values: [30, 25, 25] }, { label: 'Wed', values: [60, 45, 60] }, { label: 'Thu', values: [40, 35, 25] }, { label: 'Fri', values: [55, 40, 50] }, { label: 'Sat', values: [25, 15, 20] }, { label: 'Sun', values: [50, 35, 50] }]} />
        </Show>
        <Show when={state.activeType === 'horizontal-bar'}>
          <ChartHorizontalBar data={[{ label: 'Product A', value: 85 }, { label: 'Product B', value: 65 }, { label: 'Product C', value: 50 }, { label: 'Product D', value: 40 }, { label: 'Product E', value: 30 }]} />
        </Show>
        <Show when={state.activeType === 'scatter'}>
          <ChartScatter yTicks={[100, 75, 50, 25, 0]} xTicks={[0, 20, 40, 60, 80, 100]} data={[{ x: 12, y: 28, series: 0 }, { x: 26, y: 48, series: 0 }, { x: 52, y: 60, series: 0 }, { x: 68, y: 72, series: 0 }, { x: 94, y: 76, series: 0 }, { x: 18, y: 18, series: 1 }, { x: 42, y: 44, series: 1 }, { x: 74, y: 50, series: 1 }, { x: 88, y: 65, series: 1 }, { x: 28, y: 24, series: 2 }, { x: 44, y: 12, series: 2 }, { x: 70, y: 26, series: 2 }, { x: 92, y: 18, series: 2 }]} />
        </Show>
        <Show when={state.activeType === 'radar'}>
          <ChartRadar data={[{ label: 'Speed', values: [85, 65] }, { label: 'Power', values: [75, 80] }, { label: 'Range', values: [65, 85] }, { label: 'Defense', values: [80, 60] }, { label: 'Health', values: [70, 75] }, { label: 'Magic', values: [75, 85] }]} />
        </Show>
        <Show when={state.activeType === 'gauge'}><ChartGauge value={75} min={0} max={100} /></Show>
        <Show when={state.activeType === 'funnel'}>
          <ChartFunnel data={[{ label: 'Visitors', value: 12500 }, { label: 'Leads', value: 8200 }, { label: 'Qualified', value: 4100 }, { label: 'Proposals', value: 1800 }, { label: 'Closed', value: 620 }]} />
        </Show>
        <Show when={state.activeType === 'waterfall'}>
          <ChartWaterfall yTicks={[200, 150, 100, 50, 0]} maxValue={200} data={[{ label: 'Start', value: 120 }, { label: '+Rev', value: 35 }, { label: '+Svc', value: 20 }, { label: '-Cost', value: -30 }, { label: '-Tax', value: -20 }, { label: 'Total', value: 125, isTotal: true }]} />
        </Show>
        <ChartLegend>
          <ChartLegendItem colorClass="bg-chart-series-1">Series 1</ChartLegendItem>
          <ChartLegendItem colorClass="bg-chart-series-2">Series 2</ChartLegendItem>
          <ChartLegendItem colorClass="bg-chart-series-3">Series 3</ChartLegendItem>
          <ChartLegendItem colorClass="bg-chart-series-4">Series 4</ChartLegendItem>
          <ChartLegendItem colorClass="bg-chart-series-5">Series 5</ChartLegendItem>
        </ChartLegend>
      </Chart>
    </div>
  );
}
