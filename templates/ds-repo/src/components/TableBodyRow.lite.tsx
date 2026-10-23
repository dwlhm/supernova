import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';
import TableNoBodyCell from './TableNoBodyCell.lite';
import TableCheckboxBodyCell from './TableCheckboxBodyCell.lite';
import TableBodyCell from './TableBodyCell.lite';

export interface TableBodyRowProps {
  rowId?: string;
  cells?: string[];
  no?: number;
  showNo?: boolean;
  showCheckbox?: boolean;
  checked?: boolean;
  checkboxAriaLabel?: string;
  className?: string;
  onSelect?: (rowId: string, checked: boolean) => void;
}

export default function TableBodyRow(props: TableBodyRowProps) {
  useDefaultProps({
    rowId: '',
    cells: [],
    no: 1,
    showNo: false,
    showCheckbox: false,
    checked: false,
    checkboxAriaLabel: 'Select row',
    className: '',
  });

  const state = useStore({
    handleSelect(rowId: string, checked: boolean) {
      if (props.onSelect) {
        props.onSelect(rowId, checked);
      }
    },
  });

  return (
    <tr
      class={cn(
        'bg-components-table-default-color-row-background-default transition-colors hover:bg-background-subtle',
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
          onCheckedChange={(rowId, checked) => state.handleSelect(rowId, checked)}
        />
      </Show>
      <For each={props.cells}>
        {(cell, index) => <TableBodyCell key={index} value={cell} />}
      </For>
    </tr>
  );
}
