import { Show, useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface BreadcrumbItemProps {
  href?: string;
  current?: boolean;
  isLast?: boolean;
  separator?: string;
  separatorIcon?: any;
  className?: string;
  children?: any;
}

export default function BreadcrumbItem(props: BreadcrumbItemProps) {
  useDefaultProps({
    href: '',
    current: false,
    isLast: false,
    separator: '/',
    className: '',
  });

  return (
    <li
      data-ctrl={typeof bindControllerProps}
      class={cn('inline-flex flex-row items-center gap-1.5', props.className)}
    >
      <Show when={props.href && !props.current}>
        <a
          href={props.href}
          class="flex flex-row justify-center items-center gap-2.5 text-sm font-normal text-foreground-muted hover:text-foreground-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary rounded-xs transition-colors"
        >
          {props.children}
        </a>
      </Show>
      <Show when={!props.href || props.current}>
        <span
          aria-current={props.current ? 'page' : undefined}
          class={cn(
            'flex flex-row justify-center items-center gap-2.5 text-sm',
            props.current
              ? 'text-foreground-default font-medium'
              : 'text-foreground-muted font-normal'
          )}
        >
          {props.children}
        </span>
      </Show>
      <Show when={!props.isLast}>
        <span aria-hidden="true" class="inline-flex items-center text-sm font-normal text-foreground-muted select-none">
          {props.separatorIcon}
          <Show when={!props.separatorIcon}>{props.separator}</Show>
        </span>
      </Show>
    </li>
  );
}
