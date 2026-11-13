import { useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn, getChartScatterState, bindControllerProps, type ChartTooltipContext } from './utils';
import Tooltip from './Tooltip.lite';

export interface ChartScatterPoint { label?: string; x: number; y: number; series?: number; tooltip?: string | ((ctx: ChartTooltipContext) => string); }

export interface ChartScatterProps {
  data?: ChartScatterPoint[]; yTicks?: number[]; xTicks?: number[]; maxX?: number; maxY?: number;
  showGridLines?: boolean; showDataLabels?: boolean; showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'; tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string; formatValue?: (value: number) => string;
  ariaLabel?: string; className?: string;
}

export default function ChartScatter(props: ChartScatterProps) {
  useDefaultProps({
    data: [], yTicks: [], xTicks: [], maxX: 100, maxY: 100,
    showGridLines: true, showDataLabels: false, showTooltip: true, tooltipPosition: 'top', tooltipClassName: '', ariaLabel: 'Scatter chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col items-start justify-start gap-3', props.className)}>
      <div class="flex w-full flex-row items-end justify-start gap-2">
        <Show when={props.yTicks && props.yTicks.length > 0}>
          <div class="flex h-40 w-7 flex-col items-end justify-between">
            <For each={props.yTicks}>{(tick: number) => <span key={tick} class="text-right text-xs font-normal text-foreground-muted">{tick}</span>}</For>
          </div>
        </Show>
        <div role="img" aria-label={props.ariaLabel} class="relative flex h-40 flex-1 flex-col items-start justify-start">
          <Show when={props.showGridLines}>
            <div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-subtle" />
              <div class="h-px w-full bg-border-default" />
            </div>
          </Show>
          <For each={getChartScatterState(props.data, props.maxX, props.maxY, props.formatTooltip, props.formatValue).points}>
            {(pt) => (
              <div key={pt.key} class="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: pt.left, top: pt.top }}>
                <Show when={props.showDataLabels}>
                  <span class="pointer-events-none absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-foreground-muted">{pt.label}</span>
                </Show>
                <Tooltip text={pt.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName}>
                  <span class="flex h-5 w-5 items-center justify-center">
                    <span class={cn('block h-2 w-2 rounded-full transition-transform duration-150 group-hover:scale-150', pt.colorClass)} />
                  </span>
                </Tooltip>
              </div>
            )}
          </For>
        </div>
      </div>
      <Show when={props.xTicks && props.xTicks.length > 0}>
        <div class="flex w-full flex-row items-start justify-start gap-2">
          <Show when={props.yTicks && props.yTicks.length > 0}><div class="h-px w-7" /></Show>
          <div class="flex flex-1 flex-row items-start justify-between">
            <For each={props.xTicks}>{(xTick: number) => <span key={xTick} class="text-xs font-normal text-foreground-muted">{xTick}</span>}</For>
          </div>
        </div>
      </Show>
    </div>
  );
}
