import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva } from './utils';

export interface StatProps {
  label?: string;
  value?: string;
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
  reversed?: boolean;
  className?: string;
  children?: any;
}

export default function Stat(props: StatProps) {
  useDefaultProps({
    label: '',
    value: '',
    size: 'md',
    muted: false,
    reversed: false,
    className: '',
  });

  return (
    <div class={cn('flex min-w-0 flex-col items-start justify-start gap-0.5', props.className)}>
      <Show when={!props.reversed && Boolean(props.label)}>
        <span class="max-w-full truncate text-xs font-normal text-foreground-muted">{props.label}</span>
      </Show>
      <Show when={props.value}>
        <span
          class={cn(
            'max-w-full truncate font-semibold',
            cva(props.size, { sm: 'text-base leading-5', md: 'text-xl leading-6', lg: 'text-2xl leading-7' }, 'md'),
            props.muted ? 'text-foreground-muted' : 'text-foreground-default'
          )}
        >
          {props.value}
        </span>
      </Show>
      <Show when={props.reversed && Boolean(props.label)}>
        <span class="max-w-full truncate text-xs font-normal text-foreground-muted">{props.label}</span>
      </Show>
      <Show when={props.children}>{props.children}</Show>
    </div>
  );
}
