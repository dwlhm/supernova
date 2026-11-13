import { useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn, cva, getChartPieState, bindControllerProps, type ChartTooltipContext } from './utils';
import Tooltip from './Tooltip.lite';

export interface ChartPoint { label: string; value: number; tooltip?: string | ((ctx: ChartTooltipContext) => string); }

export interface ChartPieProps {
  data?: ChartPoint[]; innerRadius?: number; centerLabel?: string;
  showDataLabels?: boolean; showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'; tooltipClassName?: string;
  formatTooltip?: (ctx: ChartTooltipContext) => string; formatValue?: (value: number) => string;
  chartClassName?: string; centerLabelClassName?: string; ariaLabel?: string; className?: string;
}

export default function ChartPie(props: ChartPieProps) {
  useDefaultProps({
    data: [], innerRadius: 0, centerLabel: '', showDataLabels: true,
    showTooltip: true, tooltipPosition: 'top', tooltipClassName: '',
    chartClassName: 'h-40 w-40', centerLabelClassName: 'w-20 text-base', ariaLabel: 'Pie chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('relative flex w-full items-center justify-center', props.className)}>
      <div class="relative flex items-center justify-center">
        <svg class={cn('shrink-0 -rotate-90', props.chartClassName)} viewBox="0 0 100 100" role="img" aria-label={props.ariaLabel}>
          <For each={getChartPieState(props.data, props.innerRadius, props.formatTooltip, props.formatValue).slices}>
            {(slice) => (
              <circle
                key={slice.key}
                cx="50"
                cy="50"
                r={getChartPieState(props.data, props.innerRadius, props.formatTooltip, props.formatValue).ringRadius}
                fill="none"
                class={cva(String(slice.seriesIndex), {
                  '0': 'stroke-chart-series-1',
                  '1': 'stroke-chart-series-2',
                  '2': 'stroke-chart-series-3',
                  '3': 'stroke-chart-series-4',
                  '4': 'stroke-chart-series-5',
                }, '0')}
                stroke-width={getChartPieState(props.data, props.innerRadius, props.formatTooltip, props.formatValue).ringWidth}
                stroke-dasharray={slice.dashArray}
                stroke-dashoffset={slice.dashOffset}
              />
            )}
          </For>
        </svg>
        <For each={getChartPieState(props.data, props.innerRadius, props.formatTooltip, props.formatValue).slices}>
          {(slice) => (
            <div key={slice.key} class="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: slice.left, top: slice.top }}>
              <Tooltip text={slice.tooltipText} position={props.tooltipPosition} open={props.showTooltip ? undefined : false} contentClassName={props.tooltipClassName}>
                <span class="h-7 w-7 rounded-full" />
              </Tooltip>
            </div>
          )}
        </For>
        <Show when={(props.innerRadius || 0) > 0 && (props.showDataLabels || props.showTooltip)}>
          <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
            <span class={cn('truncate font-semibold text-foreground-default', props.centerLabelClassName)}>
              {props.centerLabel || getChartPieState(props.data, props.innerRadius, props.formatTooltip, props.formatValue).displayTotal}
            </span>
          </div>
        </Show>
      </div>
    </div>
  );
}
