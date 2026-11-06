import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface BreadcrumbItemProps {
  href?: string;
  isCurrent?: boolean;
  isEllipsis?: boolean;
  className?: string;
  children?: any;
  onNavigate?: (href: string) => void;
}

export default function BreadcrumbItem(props: BreadcrumbItemProps) {
  useDefaultProps({
    href: '#',
    isCurrent: false,
    isEllipsis: false,
    className: '',
  });

  return (
    <li
      data-ctrl={typeof bindControllerProps}
      class={cn('flex flex-row justify-center items-center gap-1.5 text-sm font-normal', props.className)}
    >
      <Show when={props.isEllipsis}>
        <span class="inline-flex items-center justify-center w-3.5 h-3.5 text-foreground-muted" aria-hidden="true">
          <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="3" cy="7" r="1" />
            <circle cx="7" cy="7" r="1" />
            <circle cx="11" cy="7" r="1" />
          </svg>
        </span>
      </Show>
      <Show when={!props.isEllipsis && props.isCurrent}>
        <span aria-current="page" class="flex flex-row justify-center items-center gap-2.5 text-sm font-normal text-foreground-default">
          {props.children}
        </span>
      </Show>
      <Show when={!props.isEllipsis && !props.isCurrent}>
        <a
          href={props.href}
          onClick={() => props.onNavigate && props.onNavigate(props.href || '#')}
          class="flex flex-row justify-center items-center gap-2.5 rounded-sm text-sm font-normal text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        >
          {props.children}
        </a>
      </Show>
      <Show when={!props.isCurrent}>
        <span class="text-sm font-normal text-foreground-muted" aria-hidden="true">/</span>
      </Show>
    </li>
  );
}
