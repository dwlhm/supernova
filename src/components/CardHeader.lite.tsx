import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: any;
  className?: string;
  children?: any;
}

export default function CardHeader(props: CardHeaderProps) {
  useDefaultProps({
    title: '',
    subtitle: '',
    className: '',
  });

  return (
    <div class={cn('flex items-start justify-between gap-2', props.className)}>
      <Show when={props.title || props.subtitle}>
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <Show when={props.title}>
            <span class="truncate text-xs font-medium text-foreground-muted">{props.title}</span>
          </Show>
          <Show when={props.subtitle}>
            <span class="truncate text-xs font-normal text-foreground-muted">{props.subtitle}</span>
          </Show>
        </div>
      </Show>
      <Show when={props.children}>
        <div class="flex shrink-0 items-center gap-2">{props.children}</div>
      </Show>
      <Show when={props.icon}>
        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background-muted p-1 text-foreground-default" aria-hidden="true">
          {props.icon}
        </span>
      </Show>
    </div>
  );
}
