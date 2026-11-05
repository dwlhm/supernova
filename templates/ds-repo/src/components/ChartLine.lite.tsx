import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, getChartLineState, bindControllerProps } from './utils';

export interface ChartPoint { label: string; value?: number; values?: number[]; }

export interface ChartLineProps {
  data?: ChartPoint[]; area?: boolean; showGridLines?: boolean; showDataLabels?: boolean;
  showAxisLabels?: boolean; showTooltip?: boolean; strokeClass?: string; fillClass?: string;
  ariaLabel?: string; className?: string;
}

export default function ChartLine(props: ChartLineProps) {
  useDefaultProps({
    data: [], area: false, showGridLines: true, showDataLabels: false, showAxisLabels: true,
    showTooltip: true, strokeClass: 'stroke-chart-series-1', fillClass: 'fill-chart-series-1',
    ariaLabel: 'Line chart', className: '',
  });

  return (
    <div data-ctrl={typeof bindControllerProps} class={cn('flex w-full flex-col gap-2', props.className)}>
      <div class="relative h-44 w-full" role="img" aria-label={props.ariaLabel}>
        <Show when={props.showGridLines}>
          <div class="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden="true">
            <div class="border-t border-border-subtle" />
            <div class="border-t border-border-subtle" />
            <div class="border-t border-border-subtle" />
            <div class="border-t border-border-subtle" />
            <div class="border-t border-border-subtle" />
          </div>
        </Show>
        <svg class="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <For each={getChartLineState(props.data, props.strokeClass, props.fillClass).lines}>
            {(line) => (
              <g key={line.key}>
                <Show when={props.area}><polygon class={cn(line.fillClass, 'opacity-20')} points={line.areaPoints} /></Show>
                <polyline class={line.strokeClass} points={line.linePoints} fill="none" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" />
              </g>
            )}
          </For>
        </svg>
        <For each={getChartLineState(props.data, props.strokeClass, props.fillClass).points}>
          {(point) => (
            <div key={point.key} tabindex={0} class="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
              <div class="flex h-5 w-5 items-center justify-center">
                <span class={cn('h-2 w-2 rounded-full transition-transform duration-150 group-hover:scale-150 group-focus:scale-150', props.fillClass ? props.fillClass.replace('fill-', 'bg-') : 'bg-chart-series-1')} />
              </div>
              <Show when={props.showTooltip}>
                <div role="tooltip" class="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 invisible opacity-0 scale-95 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100 flex flex-col gap-0.5 rounded-lg border border-border-default bg-background-default px-2.5 py-1.5 shadow-lg backdrop-blur-sm min-w-20 whitespace-nowrap">
                  <span class="text-xs font-medium text-foreground-muted">{point.label}</span>
                  <For each={point.valuesList}>
                    {(valItem) => (
                      <div key={valItem.key} class="flex items-center gap-1.5">
                        <span class={cn('h-2 w-2 shrink-0 rounded-full', valItem.colorClass)} />
                        <span class="text-xs font-bold text-foreground-default">{valItem.value}</span>
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
          <For each={getChartLineState(props.data, props.strokeClass, props.fillClass).points}>
            {(point) => (
              <span key={point.key} class="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
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
