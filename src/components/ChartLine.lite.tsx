import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getChartLineState, sliceChartWindow, bindControllerProps, type ChartTooltipContext, type ChartZoomRange } from './utils';
import Tooltip from './Tooltip.lite';

export interface ChartPoint { label: string; value?: number; values?: number[]; tooltip?: string | ((ctx: ChartTooltipContext) => string); }

export interface ChartLineProps {
  data?: ChartPoint[]; yTicks?: number[]; maxValue?: number; zoomRange?: ChartZoomRange; area?: boolean;
  showGridLines?: boolean; showDataLabels?: boolean; showAxisLabels?: boolean; showDots?: boolean;
  showTooltip?: boolean; tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'; tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string; formatValue?: (value: number) => string;
  strokeClass?: string; fillClass?: string; chartClassName?: string; ariaLabel?: string; className?: string;
}

export default function ChartLine(props: ChartLineProps) {
  useDefaultProps({
    data: [], yTicks: [], maxValue: 0, zoomRange: undefined, area: false, showGridLines: true, showDataLabels: false,
    showAxisLabels: true, showDots: true, showTooltip: true, tooltipPosition: 'top', tooltipClassName: '',
    strokeClass: 'stroke-chart-series-1', fillClass: 'fill-chart-series-1', chartClassName: 'h-40',
    ariaLabel: 'Line chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-2', props.className)}>
      <div class="flex w-full flex-row items-end justify-start gap-2">
        <Show when={props.yTicks && props.yTicks.length > 0}>
          <div class="flex h-40 w-7 flex-col items-end justify-between">
            <For each={props.yTicks}>{(tick: number) => <span key={tick} class="text-right text-xs font-normal text-foreground-muted">{tick}</span>}</For>
          </div>
        </Show>
        <div class={cn('relative flex-1', props.chartClassName)} role="img" aria-label={props.ariaLabel}>
          <Show when={props.showGridLines}>
            <div class="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden="true">
              <div class="border-t border-border-subtle" />
              <div class="border-t border-border-subtle" />
              <div class="border-t border-border-subtle" />
              <div class="border-t border-border-subtle" />
              <div class="border-t border-border-default" />
            </div>
          </Show>
          <svg class="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <For each={getChartLineState(sliceChartWindow(props.data, props.zoomRange), props.strokeClass, props.fillClass, props.maxValue, props.formatTooltip, props.formatValue).lines}>
              {(line) => (
                <g key={line.key}>
                  <Show when={props.area}><polygon class={cn(line.fillClass, 'opacity-25')} points={line.areaPoints} /></Show>
                  <polyline class={line.strokeClass} points={line.linePoints} fill="none" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" />
                </g>
              )}
            </For>
          </svg>
          <For each={getChartLineState(sliceChartWindow(props.data, props.zoomRange), props.strokeClass, props.fillClass, props.maxValue, props.formatTooltip, props.formatValue).points}>
            {(point) => (
              <div key={point.key} class="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
                <Show when={props.showDataLabels}><span class="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 text-xs font-medium text-foreground-default">{point.displayValue}</span></Show>
                <Tooltip text={point.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName}>
                  <div class="flex h-5 w-5 items-center justify-center">
                    <Show when={props.showDots}>
                      <span class={cn('h-2 w-2 origin-center rounded-full transition-transform duration-150 group-hover:scale-150', props.fillClass ? props.fillClass.replace('fill-', 'bg-') : 'bg-chart-series-1')} />
                    </Show>
                  </div>
                </Tooltip>
              </div>
            )}
          </For>
        </div>
      </div>
      <Show when={props.showAxisLabels}>
        <div class="flex w-full flex-row items-start justify-start gap-2">
          <Show when={props.yTicks && props.yTicks.length > 0}><div class="h-px w-7" /></Show>
          <div class="flex flex-1 flex-row items-start justify-between">
            <For each={getChartLineState(sliceChartWindow(props.data, props.zoomRange), props.strokeClass, props.fillClass, props.maxValue).points}>{(point) => <span key={point.key} class="flex-1 truncate text-center text-xs text-foreground-muted">{point.label}</span>}</For>
          </div>
        </div>
      </Show>
    </div>
  );
}
