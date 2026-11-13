import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';
export interface TableCellValueProps {
  layout?: 'row' | 'stacked';
  align?: 'left' | 'center' | 'right';
  status?: 'none' | 'success' | 'warning' | 'destructive' | 'info';
  secondaryText?: string;
  badgeText?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  children?: any;
}

export default function TableCellValue(props: TableCellValueProps) {
  useDefaultProps({
    layout: 'row', align: 'left', status: 'none',
    secondaryText: '', badgeText: '', imageSrc: '', imageAlt: '', className: '',
  });

  return (
    <span
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex min-w-0 text-sm text-foreground-default',
        cva(props.layout, { row: 'flex-row items-center gap-2 font-normal', stacked: 'flex-col items-start gap-0.5 font-medium' }, 'row'),
        cva(props.align, { left: 'justify-start text-left', center: 'justify-center text-center', right: 'justify-end text-right tabular-nums' }, 'left'),
        props.className
      )}
    >
      <Show when={props.imageSrc !== ''}>
        <img src={props.imageSrc} alt={props.imageAlt} class="h-7 w-7 shrink-0 rounded object-cover" />
      </Show>
      <Show when={props.status !== 'none'}>
        <span
          class={cn('h-2 w-2 shrink-0 rounded-full', cva(props.status, { none: 'hidden', success: 'bg-success-default', warning: 'bg-warning-default', destructive: 'bg-destructive-default', info: 'bg-info-default' }, 'none'))}
          aria-hidden="true"
        />
      </Show>
      <Show when={props.children}>{props.children}</Show>
      <Show when={props.secondaryText !== ''}>
        <span class="text-xs font-normal text-foreground-muted">{props.secondaryText}</span>
      </Show>
      <Show when={props.badgeText !== ''}>
        <span class="inline-flex h-5 items-center rounded-full bg-primary-subtle px-2 py-0.5 text-xs font-medium text-primary-subtle-foreground">{props.badgeText}</span>
      </Show>
    </span>
  );
}
