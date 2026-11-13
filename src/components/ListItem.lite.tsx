import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva } from './utils';

export interface ListItemProps {
  value?: string;
  badge?: string;
  dotTone?: 'series-1' | 'series-2' | 'series-3' | 'muted' | 'none';
  className?: string;
  children?: any;
}

export default function ListItem(props: ListItemProps) {
  useDefaultProps({
    value: '',
    badge: '',
    dotTone: 'series-1',
    className: '',
  });

  return (
    <div class={cn('flex w-full flex-row items-center justify-between gap-2', props.className)}>
      <div class="flex min-w-0 flex-row items-center justify-start gap-2">
        <Show when={props.badge}>
          <span class="flex h-5 items-center justify-center rounded-sm bg-background-muted px-1 py-0.5 text-xs font-semibold text-foreground-default">
            {props.badge}
          </span>
        </Show>
        <Show when={!props.badge && props.dotTone !== 'none'}>
          <span
            class={cn(
              'h-1.5 w-1.5 shrink-0 rounded-full',
              cva(
                props.dotTone,
                {
                  'series-1': 'bg-chart-series-1',
                  'series-2': 'bg-chart-series-2',
                  'series-3': 'bg-chart-series-3',
                  muted: 'bg-foreground-muted',
                },
                'series-1'
              )
            )}
            aria-hidden="true"
          />
        </Show>
        <span class="truncate text-xs font-normal text-foreground-default">{props.children}</span>
      </div>
      <Show when={props.value}>
        <span class="shrink-0 text-xs font-semibold text-foreground-default">{props.value}</span>
      </Show>
    </div>
  );
}
