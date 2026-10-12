import { useStore, useDefaultProps, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ChartPoint {
  label: string;
  value: number;
}

export interface PieSlice {
  key: string;
  label: string;
  value: number;
  dashArray: string;
  dashOffset: string;
  colorClass: string;
}

export interface ChartPieProps {
  data?: ChartPoint[];
  innerRadius?: number;
  ariaLabel?: string;
  className?: string;
}

export default function ChartPie(props: ChartPieProps) {
  useDefaultProps({
    data: [],
    innerRadius: 0,
    ariaLabel: 'Pie chart',
    className: '',
  });

  const state = useStore({
    get ringRadius() {
      const inner = props.innerRadius;
      if (inner > 0 && inner < 50) {
        return (50 + inner) / 2;
      }
      return 25;
    },
    get ringWidth() {
      const inner = props.innerRadius;
      if (inner > 0 && inner < 50) {
        return 50 - inner;
      }
      return 50;
    },
    get slices() {
      const rows: ChartPoint[] = props.data || [];
      const inner = props.innerRadius;
      let radius = 25;
      if (inner > 0 && inner < 50) {
        radius = (50 + inner) / 2;
      }
      const circumference = 2 * Math.PI * radius;
      let total = 0;
      for (let i = 0; i < rows.length; i++) {
        total = total + rows[i].value;
      }
      const output: PieSlice[] = [];
      let running = 0;
      for (let i = 0; i < rows.length; i++) {
        const fraction = total > 0 ? rows[i].value / total : 0;
        const length = fraction * circumference;
        let colorClass = 'stroke-chart-series-1';
        const mod = i % 5;
        if (mod === 1) {
          colorClass = 'stroke-chart-series-2';
        } else if (mod === 2) {
          colorClass = 'stroke-chart-series-3';
        } else if (mod === 3) {
          colorClass = 'stroke-chart-series-4';
        } else if (mod === 4) {
          colorClass = 'stroke-chart-series-5';
        }
        output.push({
          key: 'slice-' + i,
          label: rows[i].label,
          value: rows[i].value,
          dashArray: length + ' ' + (circumference - length),
          dashOffset: String(-running * circumference),
          colorClass: colorClass,
        });
        running = running + fraction;
      }
      return output;
    },
  });

  return (
    <div class={cn('flex w-full items-center justify-center', props.className)}>
      <svg
        class="h-44 w-44 shrink-0 -rotate-90"
        viewBox="0 0 100 100"
        role="img"
        aria-label={props.ariaLabel}
      >
        <For each={state.slices}>
          {(slice) => (
            <circle
              key={slice.key}
              cx="50"
              cy="50"
              r={state.ringRadius}
              fill="none"
              class={slice.colorClass}
              stroke-width={state.ringWidth}
              stroke-dasharray={slice.dashArray}
              stroke-dashoffset={slice.dashOffset}
            />
          )}
        </For>
      </svg>
    </div>
  );
}
