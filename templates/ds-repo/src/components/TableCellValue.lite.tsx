import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableCellValueProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  statusLabel?: string;
  imageSrc?: string;
  avatarInitials?: string;
  href?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children?: any;
}

export default function TableCellValue(props: TableCellValueProps) {
  useDefaultProps({
    value: '',
    secondaryValue: '',
    badgeLabel: '',
    statusLabel: '',
    imageSrc: '',
    avatarInitials: '',
    href: '',
    align: 'left',
    className: '',
  });

  const state = useStore({
    get containerClasses() {
      switch (props.align) {
        case 'center':
          return 'justify-center';
        case 'right':
          return 'flex-row-reverse justify-start';
        case 'left':
        default:
          return 'justify-start';
      }
    },
    get textAlignClasses() {
      switch (props.align) {
        case 'center':
          return 'items-center text-center';
        case 'right':
          return 'items-end text-right';
        case 'left':
        default:
          return 'items-start text-left';
      }
    },
  });

  return (
    <span class={cn('flex min-w-0 items-center gap-2', state.containerClasses, props.className)}>
      <Show when={props.imageSrc !== ''}>
        <img
          src={props.imageSrc}
          alt=""
          class="h-8 w-8 shrink-0 rounded-rounded-sm object-cover"
          aria-hidden="true"
        />
      </Show>
      <Show when={props.avatarInitials !== ''}>
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-components-avatar-all-color-container-background-default text-xs font-medium uppercase text-components-avatar-all-color-initials-foreground-default"
          aria-hidden="true"
        >
          {props.avatarInitials}
        </span>
      </Show>
      <span class={cn('flex min-w-0 flex-col gap-0.5', state.textAlignClasses)}>
        <Show when={props.href !== ''}>
          <a
            href={props.href}
            class="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          >
            {props.value}
          </a>
        </Show>
        <Show when={props.href === '' && props.value !== ''}>
          <span class="truncate text-sm text-components-table-default-color-cell-foreground-default">
            {props.value}
          </span>
        </Show>
        <Show when={props.secondaryValue !== ''}>
          <span class="truncate text-xs text-components-table-default-color-cell-foreground-muted">
            {props.secondaryValue}
          </span>
        </Show>
        <Show when={props.badgeLabel !== ''}>
          <span class="inline-flex w-fit items-center gap-1 rounded-rounded-full bg-components-badge-secondary-color-container-background-default px-2 py-0.5 text-xs font-medium leading-none text-components-badge-secondary-color-label-foreground-default">
            {props.badgeLabel}
          </span>
        </Show>
        <Show when={props.statusLabel !== ''}>
          <span class="inline-flex w-fit items-center gap-1 text-xs text-components-table-default-color-cell-foreground-muted">
            <span
              class="h-1.5 w-1.5 shrink-0 rounded-rounded-full bg-components-avatar-all-color-status-background-online"
              aria-hidden="true"
            />
            {props.statusLabel}
          </span>
        </Show>
      </span>
      <Show when={props.children}>
        {props.children}
      </Show>
    </span>
  );
}
