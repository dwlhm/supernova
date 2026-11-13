import { Show, useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface BreadcrumbEllipsisProps {
  isLast?: boolean;
  separator?: string;
  separatorIcon?: any;
  ariaLabel?: string;
  className?: string;
  onClick?: () => void;
}

export default function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  useDefaultProps({
    isLast: false,
    separator: '/',
    ariaLabel: 'More pages',
    className: '',
  });

  return (
    <li
      data-ctrl={typeof bindControllerProps}
      role={props.onClick ? undefined : 'presentation'}
      aria-hidden={props.onClick ? undefined : 'true'}
      class={cn('inline-flex flex-row items-center gap-1.5', props.className)}
    >
      <Show when={props.onClick}>
        <button
          type="button"
          aria-label={props.ariaLabel}
          class="flex h-5 w-5 cursor-pointer flex-row items-center justify-center rounded-xs text-foreground-muted hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          onClick={() => props.onClick && props.onClick()}
        >
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5">
            <circle cx="3" cy="7" r="1" fill="currentColor" />
            <circle cx="7" cy="7" r="1" fill="currentColor" />
            <circle cx="11" cy="7" r="1" fill="currentColor" />
          </svg>
        </button>
      </Show>
      <Show when={!props.onClick}>
        <span class="flex flex-row justify-center items-center w-3.5 h-3.5 text-foreground-muted">
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5">
            <circle cx="3" cy="7" r="1" fill="currentColor" />
            <circle cx="7" cy="7" r="1" fill="currentColor" />
            <circle cx="11" cy="7" r="1" fill="currentColor" />
          </svg>
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
