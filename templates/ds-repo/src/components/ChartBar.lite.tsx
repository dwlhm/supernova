import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartBarProps {
  data?: ChartPoint[];
  colorClass?: string;
  showGridLines?: boolean;
  showDataLabels?: boolean;
  showAxisLabels?: boolean;
  ariaLabel?: string;
  className?: string;
}

export default function ChartBar(props: ChartBarProps) {
  useDefaultProps({
    data: [],
    colorClass: 'bg-chart-series-1',
    showGridLines: true,
    showDataLabels: true,
    showAxisLabels: true,
    ariaLabel: 'Bar chart',
    className: '',
  });

  const state = useStore({
    barHeight(value: number) {
      const rows: ChartPoint[] = props.data || [];
      let max = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].value > max) {
          max = rows[i].value;
        }
      }
      if (max <= 0) {
        return '0%';
      }
      const pct = (value / max) * 100;
      if (pct < 0) {
        return '0%';
      }
      return pct + '%';
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-2', props.className)}>
      <div class="relative flex h-44 w-full items-end gap-2" role="img" aria-label={props.ariaLabel}>
        <Show when={props.showGridLines}>
          <div
            class="pointer-events-none absolute inset-0 flex flex-col justify-between"
            aria-hidden="true"
          >
            <div class="border-t border-components-chart-all-color-grid-line-stroke-default" />
            <div class="border-t border-components-chart-all-color-grid-line-stroke-default" />
            <div class="border-t border-components-chart-all-color-grid-line-stroke-default" />
            <div class="border-t border-components-chart-all-color-grid-line-stroke-default" />
            <div class="border-t border-components-chart-all-color-grid-line-stroke-default" />
          </div>
        </Show>
        <For each={props.data}>
          {(point) => (
            <div key={point.label} class="relative flex h-full flex-1 items-end">
              <div
                class={cn('w-full rounded-rounded-sm', props.colorClass)}
                style={{ height: state.barHeight(point.value) }}
              />
            </div>
          )}
        </For>
      </div>
      <Show when={props.showAxisLabels}>
        <div class="flex w-full items-start gap-2">
          <For each={props.data}>
            {(point) => (
              <span
                key={point.label}
                class="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
              >
                <Show when={props.showDataLabels}>
                  <span class="text-xs font-medium text-components-chart-all-color-data-label-text-default">
                    {point.value}
                  </span>
                </Show>
                <span class="w-full truncate text-xs text-components-chart-all-color-axis-label-text-default">
                  {point.label}
                </span>
              </span>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
