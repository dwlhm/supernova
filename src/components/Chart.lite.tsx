import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';
import ChartLegend from './ChartLegend.lite';
import ChartBar from './ChartBar.lite';
import ChartLine from './ChartLine.lite';
import ChartPie from './ChartPie.lite';

export interface ChartLegendEntry { label: string; colorClass: string; }
export interface ChartDataPoint { label: string; value?: number; values?: number[]; }

export interface ChartProps {
  type?: 'bar' | 'line' | 'area' | 'pie' | 'donut';
  title?: string;
  description?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  showTooltip?: boolean;
  legend?: ChartLegendEntry[];
  data?: ChartDataPoint[];
  showLegend?: boolean;
  className?: string;
  children?: any;
}

export default function Chart(props: ChartProps) {
  useDefaultProps({
    type: 'bar', title: 'Revenue Overview', description: 'Weekly revenue breakdown by day',
    showTitle: true, showDescription: true, showTooltip: true, legend: [], data: [], showLegend: true, className: '',
  });

  return (
    <figure
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex w-full flex-col gap-4 rounded-lg border border-border-default bg-background-default p-5 shadow-sm',
        props.className
      )}
    >
      <Show when={props.showTitle || props.showDescription}>
        <figcaption class="flex flex-col gap-1">
          <Show when={props.showTitle}>
            <span class="text-base leading-6 font-semibold text-foreground-default">{props.title}</span>
          </Show>
          <Show when={props.showDescription}>
            <span class="text-sm text-foreground-muted">{props.description}</span>
          </Show>
        </figcaption>
      </Show>
      <Show when={props.children}>
        <div class="w-full">{props.children}</div>
      </Show>
      <Show when={!props.children}>
        <div class="w-full">
          <Show when={props.type === 'bar'}>
            <ChartBar data={props.data} showTooltip={props.showTooltip} ariaLabel={props.title} />
          </Show>
          <Show when={props.type === 'line' || props.type === 'area'}>
            <ChartLine data={props.data} area={props.type === 'area'} showTooltip={props.showTooltip} ariaLabel={props.title} />
          </Show>
          <Show when={props.type === 'pie' || props.type === 'donut'}>
            <ChartPie data={props.data} innerRadius={props.type === 'donut' ? 30 : 0} showTooltip={props.showTooltip} ariaLabel={props.title} />
          </Show>
        </div>
      </Show>
      <Show when={props.showLegend}>
        <ChartLegend items={props.legend} />
      </Show>
    </figure>
  );
}
