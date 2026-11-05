import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, bindControllerProps, getTableBodyRowCells, TableColItem, TableCellInput } from './utils';
import TableNoBodyCell from './TableNoBodyCell.lite';
import TableCheckboxBodyCell from './TableCheckboxBodyCell.lite';
import TableBodyCell from './TableBodyCell.lite';

export interface TableBodyRowProps {
  rowId?: string;
  cells?: TableCellInput[];
  columns?: TableColItem[];
  no?: number;
  showNo?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  checkboxAriaLabel?: string;
  className?: string;
  children?: any;
  onSelect?: (rowId: string, checked: boolean) => void;
}

export default function TableBodyRow(props: TableBodyRowProps) {
  useDefaultProps({
    rowId: '', cells: [], columns: [], no: 1, showNo: false, showCheckbox: false,
    checked: false, checkboxAriaLabel: 'Select row', className: '',
  });

  return (
    <tr
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'border-b border-border-default bg-background-default transition-colors hover:bg-background-subtle',
        props.className
      )}
    >
      <Show when={props.showNo}>
        <TableNoBodyCell no={props.no} />
      </Show>
      <Show when={props.showCheckbox}>
        <TableCheckboxBodyCell
          checked={props.checked}
          rowId={props.rowId}
          ariaLabel={props.checkboxAriaLabel}
          onCheckedChange={(rowId, checked) => props.onSelect && props.onSelect(rowId, checked)}
        />
      </Show>
      <Show when={props.children}>{props.children}</Show>
      <Show when={!props.children}>
        <For each={getTableBodyRowCells(props.cells, props.columns)}>
          {(cell, index) => (
            <TableBodyCell
              key={index}
              value={cell.value}
              secondaryValue={cell.secondaryValue}
              badgeLabel={cell.badgeLabel}
              buttonLabel={cell.buttonLabel}
              statusLabel={cell.statusLabel}
              imageSrc={cell.imageSrc}
              avatarInitials={cell.avatarInitials}
              href={cell.href}
              align={cell.align}
            />
          )}
        </For>
      </Show>
    </tr>
  );
}
