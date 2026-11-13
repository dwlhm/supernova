import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, ICON_PATHS, bindControllerProps } from './utils';

export interface TableHeaderCellProps {
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | 'none';
  sortIcon?: any;
  className?: string;
  children?: any;
  onSort?: () => void;
}

export default function TableHeaderCell(props: TableHeaderCellProps) {
  useDefaultProps({
    align: 'left',
    sortable: false,
    sortDirection: 'none',
    className: '',
  });

  return (
    <th
      data-ctrl={typeof bindControllerProps}
      scope="col"
      aria-sort={props.sortable ? (props.sortDirection === 'asc' ? 'ascending' : props.sortDirection === 'desc' ? 'descending' : 'none') : undefined}
      class={cn(
        'px-4 py-3 text-sm font-medium text-foreground-default',
        props.align === 'center'
          ? 'text-center'
          : props.align === 'right'
            ? 'text-right'
            : 'text-left',
        props.className,
      )}
    >
      <Show when={props.sortable}>
        <button
          type="button"
          class={cn(
            'inline-flex cursor-pointer items-center gap-1.5 rounded-xs font-medium text-foreground-default select-none hover:text-foreground-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
            props.align === 'right' && 'ml-auto flex-row-reverse'
          )}
          onClick={() => props.onSort && props.onSort()}
        >
          <span>{props.children}</span>
          {props.sortIcon}
          <Show when={!props.sortIcon}>
            <svg aria-hidden="true" class={cn('h-3.5 w-3.5 shrink-0 transition-colors', props.sortDirection !== 'none' ? 'text-foreground-default' : 'text-foreground-subtle')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d={props.sortDirection === 'asc' ? ICON_PATHS.chevronUp : ICON_PATHS.chevronDown} stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Show>
        </button>
      </Show>
      <Show when={!props.sortable}>
        {props.children}
      </Show>
    </th>
  );
}
