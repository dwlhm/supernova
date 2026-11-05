import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';
import TableNoHeaderCell from './TableNoHeaderCell.lite';
import TableCheckboxHeaderCell from './TableCheckboxHeaderCell.lite';

export interface TableHeaderColumn {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableHeaderRowProps {
  columns?: TableHeaderColumn[];
  showCheckbox?: boolean;
  showNo?: boolean;
  allSelected?: boolean;
  checkboxAriaLabel?: string;
  className?: string;
  children?: any;
  onSelectAll?: (checked: boolean) => void;
}

export default function TableHeaderRow(props: TableHeaderRowProps) {
  useDefaultProps({
    columns: [], showCheckbox: false, showNo: false,
    allSelected: false, checkboxAriaLabel: 'Select all rows', className: '',
  });

  return (
    <tr
      data-ctrl={typeof bindControllerProps}
      class={cn('border-b border-border-default bg-background-muted', props.className)}
    >
      <Show when={props.showNo}>
        <TableNoHeaderCell />
      </Show>
      <Show when={props.showCheckbox}>
        <TableCheckboxHeaderCell
          checked={props.allSelected}
          ariaLabel={props.checkboxAriaLabel}
          onCheckedChange={(checked) => props.onSelectAll && props.onSelectAll(checked)}
        />
      </Show>
      <Show when={props.children}>{props.children}</Show>
      <Show when={!props.children}>
        <For each={props.columns}>
          {(column) => (
            <th
              key={column.id}
              scope="col"
              class={cn(
                'whitespace-nowrap bg-background-muted px-4 py-3 text-sm font-medium text-foreground-default',
                cva(column.align, { left: 'text-left', center: 'text-center', right: 'text-right' }, 'left')
              )}
            >
              {column.label}
            </th>
          )}
        </For>
      </Show>
    </tr>
  );
}
