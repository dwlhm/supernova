import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';
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
  onSelectAll?: (checked: boolean) => void;
}

export default function TableHeaderRow(props: TableHeaderRowProps) {
  useDefaultProps({
    columns: [],
    showCheckbox: false,
    showNo: false,
    allSelected: false,
    checkboxAriaLabel: 'Select all rows',
    className: '',
  });

  const state = useStore({
    alignmentClasses(align: string) {
      if (align === 'center') {
        return 'text-center';
      }
      if (align === 'right') {
        return 'text-right';
      }
      return 'text-left';
    },
    handleSelectAll(checked: boolean) {
      if (props.onSelectAll) {
        props.onSelectAll(checked);
      }
    },
  });

  return (
    <tr
      class={cn(
        'border-b border-components-table-default-color-divider-border-default',
        props.className
      )}
    >
      <Show when={props.showNo}>
        <TableNoHeaderCell />
      </Show>
      <Show when={props.showCheckbox}>
        <TableCheckboxHeaderCell
          checked={props.allSelected}
          ariaLabel={props.checkboxAriaLabel}
          onCheckedChange={(checked) => state.handleSelectAll(checked)}
        />
      </Show>
      <For each={props.columns}>
        {(column) => (
          <th
            key={column.id}
            scope="col"
            class={cn(
              'whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default',
              state.alignmentClasses(column.align)
            )}
          >
            {column.label}
          </th>
        )}
      </For>
    </tr>
  );
}
