import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, bindControllerProps, type ChartTooltipContext } from './utils';

export interface ChartLegendEntry { label: string; colorClass: string; }
export interface ChartDataPoint { label: string; value?: number; values?: number[]; tooltip?: string | ((ctx: ChartTooltipContext) => string); }

export interface ChartProps {
  title?: string;
  description?: string;
  className?: string;
  children?: any;
}

export default function Chart(props: ChartProps) {
  useDefaultProps({
    title: '',
    description: '',
    className: '',
  });

  return (
    <figure
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex w-full flex-col items-start justify-start gap-4 rounded-lg border border-border-default bg-background-default px-5 py-5 shadow-sm',
        props.className
      )}
    >
      <Show when={props.title || props.description}>
        <figcaption class="flex flex-col items-start justify-start gap-1">
          <Show when={props.title}>
            <span class="text-base leading-6 font-semibold text-foreground-default">{props.title}</span>
          </Show>
          <Show when={props.description}>
            <span class="text-sm font-normal text-foreground-muted">{props.description}</span>
          </Show>
        </figcaption>
      </Show>
      {props.children}
    </figure>
  );
}
