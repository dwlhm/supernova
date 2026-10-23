import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';
import ChartLegend from './ChartLegend.lite';

export interface ChartLegendEntry {
  label: string;
  colorClass: string;
}

export interface ChartProps {
  title?: string;
  description?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  legend?: ChartLegendEntry[];
  showLegend?: boolean;
  className?: string;
  children?: any;
}

export default function Chart(props: ChartProps) {
  useDefaultProps({
    title: 'Revenue Overview',
    description: 'Weekly revenue breakdown by day',
    showTitle: true,
    showDescription: true,
    legend: [],
    showLegend: true,
    className: '',
  });

  const state = useStore({
    get hasHeading() {
      return props.showTitle || props.showDescription;
    },
  });

  return (
    <figure
      class={cn(
        'flex w-full flex-col gap-4 rounded-rounded-lg border border-components-chart-all-color-container-border-default bg-components-chart-all-color-container-background-default p-5',
        props.className
      )}
    >
      <Show when={state.hasHeading}>
        <figcaption class="flex flex-col gap-1">
          <Show when={props.showTitle}>
            <span class="text-sm font-semibold text-components-chart-all-color-title-text-default">
              {props.title}
            </span>
          </Show>
          <Show when={props.showDescription}>
            <span class="text-xs text-components-chart-all-color-description-text-default">
              {props.description}
            </span>
          </Show>
        </figcaption>
      </Show>
      <Show when={props.showLegend}>
        <ChartLegend items={props.legend} />
      </Show>
      <div class="w-full">{props.children}</div>
    </figure>
  );
}
