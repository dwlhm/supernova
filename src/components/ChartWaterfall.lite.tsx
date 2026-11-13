import { useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn, getChartWaterfallState, sliceChartWindow, bindControllerProps, type ChartTooltipContext, type ChartZoomRange } from './utils';
import Tooltip from './Tooltip.lite';

export interface ChartWaterfallPoint { label: string; value: number; isTotal?: boolean; tooltip?: string | ((ctx: ChartTooltipContext) => string); }

export interface ChartWaterfallProps {
  data?: ChartWaterfallPoint[]; yTicks?: number[]; maxValue?: number; zoomRange?: ChartZoomRange;
  showGridLines?: boolean; showDataLabels?: boolean; showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'; tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string; formatValue?: (value: number) => string;
  ariaLabel?: string; className?: string;
}

export default function ChartWaterfall(props: ChartWaterfallProps) {
  useDefaultProps({
    data: [], yTicks: [], maxValue: 0, zoomRange: undefined, showGridLines: true,
    showDataLabels: false, showTooltip: true, tooltipPosition: 'top', tooltipClassName: '', ariaLabel: 'Waterfall chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col items-start justify-start gap-3', props.className)}>
      <div class="flex w-full flex-row items-end justify-start gap-2">
        <Show when={props.yTicks && props.yTicks.length > 0}>
          <div class="flex h-40 w-7 flex-col items-end justify-between">
            <For each={props.yTicks}>{(tick: number) => <span key={tick} class="text-right text-xs font-normal text-foreground-muted">{tick}</span>}</For>
          </div>
        </Show>
        <div role="img" aria-label={props.ariaLabel} class="relative flex h-40 flex-1 flex-row items-end justify-between gap-2 px-2">
          <Show when={props.showGridLines}>
            <div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-default" />
            </div>
          </Show>
          <For each={getChartWaterfallState(sliceChartWindow(props.data, props.zoomRange), props.maxValue, props.formatTooltip, props.formatValue).bars}>
            {(bar) => (
              <div key={bar.key} class="relative h-full flex-1">
                <div class="absolute inset-x-1" style={{ bottom: bar.bottom, height: bar.height }}>
                  <Show when={props.showDataLabels}>
                    <span class="pointer-events-none absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-foreground-default">{bar.displayValue}</span>
                  </Show>
                  <Tooltip text={bar.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName} className="h-full w-full">
                    <div class={cn('h-full w-full rounded-xs transition-all duration-150', bar.colorClass)} />
                  </Tooltip>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="flex w-full flex-row items-start justify-start gap-2">
        <Show when={props.yTicks && props.yTicks.length > 0}><div class="h-px w-7" /></Show>
        <div class="flex flex-1 flex-row items-start justify-between px-2">
          <For each={sliceChartWindow(props.data, props.zoomRange)}>{(item: ChartWaterfallPoint) => <span key={item.label} class="flex-1 text-center text-xs font-normal text-foreground-muted">{item.label}</span>}</For>
        </div>
      </div>
    </div>
  );
}
