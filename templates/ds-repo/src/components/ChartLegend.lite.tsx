import { useStore, useDefaultProps, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface ChartLegendItem {
  label: string;
  colorClass: string;
}

export interface ChartLegendProps {
  items?: ChartLegendItem[];
  className?: string;
}

export default function ChartLegend(props: ChartLegendProps) {
  useDefaultProps({
    items: [],
    className: '',
  });

  const state = useStore({
    get dotClasses() {
      return 'h-2 w-2 shrink-0 rounded-rounded-full';
    },
  });

  return (
    <ul class={cn('flex flex-wrap items-center gap-4', props.className)}>
      <For each={props.items}>
        {(item) => (
          <li key={item.label} class="flex items-center gap-2">
            <span class={cn(state.dotClasses, item.colorClass)} aria-hidden="true" />
            <span class="text-xs text-components-chart-all-color-legend-label-text-default">
              {item.label}
            </span>
          </li>
        )}
      </For>
    </ul>
  );
}
