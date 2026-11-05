import { useDefaultProps, For, Show } from '@builder.io/mitosis';
import { cn, cva, getChartPieState, bindControllerProps } from './utils';

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartPieProps {
  data?: ChartPoint[];
  innerRadius?: number;
  showTooltip?: boolean;
  ariaLabel?: string;
  className?: string;
}

export default function ChartPie(props: ChartPieProps) {
  useDefaultProps({
    data: [], innerRadius: 0, showTooltip: true, ariaLabel: 'Pie chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('relative flex w-full items-center justify-center', props.className)}>
      <div class="relative flex items-center justify-center">
        <svg
          class="h-44 w-44 shrink-0 -rotate-90"
          viewBox="0 0 100 100"
          role="img"
          aria-label={props.ariaLabel}
        >
          <For each={getChartPieState(props.data, props.innerRadius).slices}>
            {(slice) => (
              <circle
                key={slice.key}
                cx="50"
                cy="50"
                r={getChartPieState(props.data, props.innerRadius).ringRadius}
                fill="none"
                class={cva(String(slice.seriesIndex), {
                  '0': 'stroke-chart-series-1',
                  '1': 'stroke-chart-series-2',
                  '2': 'stroke-chart-series-3',
                  '3': 'stroke-chart-series-4',
                  '4': 'stroke-chart-series-5',
                }, '0')}
                stroke-width={getChartPieState(props.data, props.innerRadius).ringWidth}
                stroke-dasharray={slice.dashArray}
                stroke-dashoffset={slice.dashOffset}
              />
            )}
          </For>
        </svg>
        <Show when={props.innerRadius > 0 && props.showTooltip}>
          <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-2">
            <span class="w-16 truncate text-xs font-medium text-foreground-muted">Total</span>
            <span class="w-16 truncate text-sm font-bold text-foreground-default">
              {getChartPieState(props.data, props.innerRadius).total}
            </span>
          </div>
        </Show>
      </div>
    </div>
  );
}
