import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getChartBarState, bindControllerProps } from './utils';

export interface ChartPoint {
  label: string;
  value?: number;
  values?: number[];
}

export interface ChartBarProps {
  data?: ChartPoint[];
  colorClass?: string;
  showGridLines?: boolean;
  showDataLabels?: boolean;
  showAxisLabels?: boolean;
  showTooltip?: boolean;
  ariaLabel?: string;
  className?: string;
}

export default function ChartBar(props: ChartBarProps) {
  useDefaultProps({
    data: [], colorClass: 'bg-chart-series-1', showGridLines: true,
    showDataLabels: true, showAxisLabels: true, showTooltip: true, ariaLabel: 'Bar chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-2', props.className)}>
      <div class="relative flex h-44 w-full items-end gap-2" role="img" aria-label={props.ariaLabel}>
        <Show when={props.showGridLines}>
          <div class="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden="true">
            <div class="border-t border-border-subtle" />
            <div class="border-t border-border-subtle" />
            <div class="border-t border-border-subtle" />
            <div class="border-t border-border-subtle" />
            <div class="border-t border-border-subtle" />
          </div>
        </Show>
        <For each={getChartBarState(props.data, props.colorClass).rows}>
          {(point) => (
            <div key={point.label} tabindex={0} class="group relative flex h-full flex-1 items-end justify-center gap-1 cursor-pointer outline-none">
              <For each={point.bars}>
                {(bar) => (
                  <div key={bar.key} class={cn('w-full rounded-sm transition-all duration-150 group-hover:brightness-110 group-focus:brightness-110', bar.colorClass)} style={{ height: bar.height }} />
                )}
              </For>
              <Show when={props.showTooltip}>
                <div role="tooltip" class="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 invisible opacity-0 scale-95 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100 flex flex-col gap-0.5 rounded-lg border border-border-default bg-background-default px-2.5 py-1.5 shadow-lg backdrop-blur-sm min-w-20 whitespace-nowrap">
                  <span class="text-xs font-medium text-foreground-muted">{point.label}</span>
                  <For each={point.bars}>
                    {(bar) => (
                      <div key={bar.key} class="flex items-center gap-1.5">
                        <span class={cn('h-2 w-2 shrink-0 rounded-full', bar.colorClass)} />
                        <span class="text-xs font-bold text-foreground-default">{bar.value}</span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>
      <Show when={props.showAxisLabels}>
        <div class="flex w-full items-start gap-2">
          <For each={getChartBarState(props.data, props.colorClass).rows}>
            {(point) => (
              <span key={point.label} class="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
                <Show when={props.showDataLabels}><span class="text-xs font-medium text-foreground-default">{point.value}</span></Show>
                <span class="w-full truncate text-xs text-foreground-muted">{point.label}</span>
              </span>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
