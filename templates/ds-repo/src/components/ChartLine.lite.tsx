import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartLineProps {
  data?: ChartPoint[];
  area?: boolean;
  showGridLines?: boolean;
  showDataLabels?: boolean;
  showAxisLabels?: boolean;
  strokeClass?: string;
  fillClass?: string;
  ariaLabel?: string;
  className?: string;
}

export default function ChartLine(props: ChartLineProps) {
  useDefaultProps({
    data: [],
    area: false,
    showGridLines: true,
    showDataLabels: false,
    showAxisLabels: true,
    strokeClass: 'stroke-chart-series-1',
    fillClass: 'fill-chart-series-1',
    ariaLabel: 'Line chart',
    className: '',
  });

  const state = useStore({
    get normalized() {
      const rows: ChartPoint[] = props.data || [];
      let max = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].value > max) {
          max = rows[i].value;
        }
      }
      if (max <= 0) {
        max = 1;
      }
      const total = rows.length;
      const points: Array<{ key: string; label: string; x: number; y: number; value: number }> = [];
      for (let i = 0; i < total; i++) {
        const x = total > 1 ? (i / (total - 1)) * 100 : 50;
        const y = 100 - (rows[i].value / max) * 100;
        points.push({
          key: 'pt-' + i,
          label: rows[i].label,
          x: x,
          y: y,
          value: rows[i].value,
        });
      }
      return points;
    },
    get linePoints() {
      const points = state.normalized;
      let output = '';
      for (let i = 0; i < points.length; i++) {
        output = output + points[i].x + ',' + points[i].y + ' ';
      }
      return output.trim();
    },
    get areaPoints() {
      const points = state.normalized;
      if (points.length === 0) {
        return '';
      }
      return '0,100 ' + state.linePoints + ' 100,100';
    },
  });

  return (
    <div class={cn('flex w-full flex-col gap-2', props.className)}>
      <div class="relative h-44 w-full" role="img" aria-label={props.ariaLabel}>
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
        <svg
          class="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <Show when={props.area}>
            <polygon class={cn(props.fillClass, 'opacity-20')} points={state.areaPoints} />
          </Show>
          <polyline
            class={props.strokeClass}
            points={state.linePoints}
            fill="none"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <Show when={props.showAxisLabels}>
        <div class="flex w-full items-start gap-2">
          <For each={state.normalized}>
            {(point) => (
              <span
                key={point.key}
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
