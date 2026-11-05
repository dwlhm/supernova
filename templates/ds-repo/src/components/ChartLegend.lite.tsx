import { useDefaultProps, For } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

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
    items: [], className: '',
  });

  return (
    <ul data-ctrl={typeof bindControllerProps} class={cn('flex flex-wrap items-center gap-4', props.className)}>
      <For each={props.items}>
        {(item) => (
          <li key={item.label} class="flex items-center gap-2">
            <span class={cn('h-2 w-2 shrink-0 rounded-full', item.colorClass)} aria-hidden="true" />
            <span class="text-xs text-foreground-muted">
              {item.label}
            </span>
          </li>
        )}
      </For>
    </ul>
  );
}
