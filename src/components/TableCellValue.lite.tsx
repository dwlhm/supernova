import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';
import Badge from './Badge.lite';
import Button from './Button.lite';

export interface TableCellValueProps {
  value?: string;
  secondaryValue?: string;
  badgeLabel?: string;
  buttonLabel?: string;
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
    value: 'Cell Value', secondaryValue: '', badgeLabel: '', buttonLabel: '', statusLabel: '',
    imageSrc: '', avatarInitials: '', href: '', align: 'left', className: '',
  });

  return (
    <span
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex min-w-0 items-center gap-2',
        cva(props.align, { left: 'justify-start', center: 'justify-center', right: 'flex-row-reverse justify-start' }, 'left'),
        props.className
      )}
    >
      <Show when={props.imageSrc === 'placeholder'}>
        <span class="h-7 w-7 shrink-0 rounded bg-background-muted" aria-hidden="true" />
      </Show>
      <Show when={props.imageSrc !== '' && props.imageSrc !== 'placeholder'}>
        <img src={props.imageSrc} alt="" class="h-7 w-7 shrink-0 rounded object-cover" aria-hidden="true" />
      </Show>
      <Show when={props.avatarInitials !== ''}>
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-muted text-xs font-medium uppercase text-foreground-subtle" aria-hidden="true">
          {props.avatarInitials}
        </span>
      </Show>
      <Show when={props.badgeLabel !== ''}>
        <Badge label={props.badgeLabel} variant="primary" />
      </Show>
      <Show when={props.buttonLabel !== ''}>
        <Button label={props.buttonLabel} variant="primary" size="small" />
      </Show>
      <Show when={props.badgeLabel === '' && props.buttonLabel === ''}>
        <span class={cn('flex min-w-0 flex-col gap-0.5', cva(props.align, { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' }, 'left'))}>
          <Show when={props.href !== ''}>
            <a href={props.href} class="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary">{props.value}</a>
          </Show>
          <Show when={props.href === '' && props.value !== ''}>
            <span class="truncate text-sm text-foreground-default">{props.value}</span>
          </Show>
          <Show when={props.secondaryValue !== ''}>
            <span class="truncate text-xs text-foreground-muted">{props.secondaryValue}</span>
          </Show>
          <Show when={props.statusLabel !== ''}>
            <span class="inline-flex w-fit items-center gap-1 text-xs text-foreground-muted">
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-success-default" aria-hidden="true" />
              {props.statusLabel}
            </span>
          </Show>
        </span>
      </Show>
      <Show when={props.children}>{props.children}</Show>
    </span>
  );
}
