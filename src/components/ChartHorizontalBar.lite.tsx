import { useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn, getChartHorizontalBarState, bindControllerProps, type ChartTooltipContext } from './utils';
import Tooltip from './Tooltip.lite';
import type { ChartDataPoint } from './Chart.lite';

export interface ChartHorizontalBarProps {
  data?: ChartDataPoint[]; maxValue?: number; valueSuffix?: string; stacked?: boolean;
  showLabels?: boolean; showDataLabels?: boolean; showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'; tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string; formatValue?: (value: number) => string;
  barColorClass?: string; barClassName?: string; ariaLabel?: string; className?: string;
}

export default function ChartHorizontalBar(props: ChartHorizontalBarProps) {
  useDefaultProps({
    data: [], maxValue: 100, valueSuffix: '%', stacked: false, showLabels: true, showDataLabels: true,
    showTooltip: true, tooltipPosition: 'top', tooltipClassName: '', barColorClass: 'bg-chart-series-1',
    barClassName: 'h-5 rounded-sm', ariaLabel: 'Horizontal bar chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} role="img" aria-label={props.ariaLabel} class={cn('flex w-full flex-col items-start justify-start gap-3', props.className)}>
      <Show when={props.stacked}>
        <div class="flex w-full flex-row items-center gap-0.5">
          <For each={getChartHorizontalBarState(props.data, props.barColorClass, props.maxValue, props.valueSuffix, props.formatTooltip, props.formatValue).rows}>
            {(row) => (
              <div key={row.key} style={{ width: row.shareWidth }}>
                <Tooltip text={row.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName} className="w-full">
                  <div class={cn('h-2 w-full rounded-xs transition-all duration-150', row.seriesColorClass, props.barClassName)} />
                </Tooltip>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Show when={!props.stacked}>
        <For each={getChartHorizontalBarState(props.data, props.barColorClass, props.maxValue, props.valueSuffix, props.formatTooltip, props.formatValue).rows}>
          {(row) => (
            <div key={row.key} class="flex w-full flex-row items-center justify-start gap-2">
              <Show when={props.showLabels}>
                <span class="w-16 shrink-0 truncate text-right text-xs font-normal text-foreground-muted">{row.label}</span>
              </Show>
              <Tooltip text={row.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName} className="flex-1">
                <div class={cn('flex w-full flex-row items-center justify-start bg-background-muted', props.barClassName)}>
                  <div class={cn('h-full rounded-sm transition-all duration-150', row.colorClass)} style={{ width: row.width }} />
                </div>
              </Tooltip>
              <Show when={props.showDataLabels}>
                <span class="w-9 shrink-0 text-right text-xs font-medium text-foreground-default">{row.displayValue}</span>
              </Show>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
