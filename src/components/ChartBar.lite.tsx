import { useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn, getChartBarState, sliceChartWindow, bindControllerProps, type ChartTooltipContext, type ChartZoomRange } from './utils';
import Tooltip from './Tooltip.lite';
import type { ChartDataPoint } from './Chart.lite';

export interface ChartBarProps {
  data?: ChartDataPoint[]; yTicks?: number[]; maxValue?: number; zoomRange?: ChartZoomRange; stacked?: boolean;
  showGridLines?: boolean; showDataLabels?: boolean; showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'; tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string; formatValue?: (value: number) => string;
  barColorClass?: string; ariaLabel?: string; className?: string;
}

export default function ChartBar(props: ChartBarProps) {
  useDefaultProps({
    data: [], yTicks: [], maxValue: 0, zoomRange: undefined, stacked: false, showGridLines: true,
    showDataLabels: false, showTooltip: true, tooltipPosition: 'top', tooltipClassName: '',
    barColorClass: 'bg-chart-series-1', ariaLabel: 'Bar chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col items-start justify-start gap-2', props.className)}>
      <div class="flex w-full flex-row items-end justify-start gap-2">
        <Show when={props.yTicks && props.yTicks.length > 0}>
          <div class="flex h-40 w-7 flex-col items-end justify-between">
            <For each={props.yTicks}>
              {(tick: number) => <span key={tick} class="text-right text-xs font-normal text-foreground-muted">{tick}</span>}
            </For>
          </div>
        </Show>
        <div role="img" aria-label={props.ariaLabel} class="relative flex h-40 flex-1 flex-col items-start justify-between">
          <Show when={props.showGridLines}>
            <div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-default" />
            </div>
          </Show>
          <div class="relative flex h-full w-full flex-row items-end justify-between gap-3 px-2">
            <For each={getChartBarState(sliceChartWindow(props.data, props.zoomRange), props.barColorClass, props.stacked, props.maxValue, props.formatTooltip, props.formatValue).rows}>
              {(row) => (
                <div key={row.key} class="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <Show when={props.showDataLabels}>
                    <span class="text-xs font-medium text-foreground-default">{row.displayValue}</span>
                  </Show>
                  <div class={cn('flex w-full flex-1', props.stacked ? 'flex-col-reverse justify-start' : 'flex-row items-end justify-center gap-1')}>
                    <For each={row.bars}>
                      {(bar) => (
                        <div key={bar.key} class="w-full" style={{ height: bar.height }}>
                          <Tooltip text={bar.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName} className="h-full w-full">
                            <div class={cn('h-full w-full transition-all duration-150', !props.stacked && 'rounded-t-xs', bar.colorClass)} />
                          </Tooltip>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class="flex w-full flex-row items-start justify-start gap-2">
        <Show when={props.yTicks && props.yTicks.length > 0}><div class="h-px w-7" /></Show>
        <div class="flex flex-1 flex-row items-start justify-between px-2">
          <For each={sliceChartWindow(props.data, props.zoomRange)}>
            {(item: ChartDataPoint) => <span key={item.label} class="flex-1 text-center text-xs font-normal text-foreground-muted">{item.label}</span>}
          </For>
        </div>
      </div>
    </div>
  );
}
