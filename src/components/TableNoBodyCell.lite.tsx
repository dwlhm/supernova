import { useStore, useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableNoBodyCellProps {
  /** Sequential row number rendered inside the cell. */
  no?: number | string;
  /** Accessible label describing the number column (e.g. "Row number"). */
  srLabel?: string;
  className?: string;
}

export default function TableNoBodyCell(props: TableNoBodyCellProps) {
  useDefaultProps({
    no: 1,
    srLabel: '',
    className: '',
  });

  const state = useStore({
    get hasSrLabel() {
      return typeof props.srLabel === 'string' && props.srLabel.length > 0;
    },
    get displayNo() {
      if (props.no === undefined || props.no === null || props.no === '') {
        return 0;
      }
      return props.no;
    },
  });

  return (
    <td
      class={cn(
        'w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center align-middle text-sm leading-5 text-components-table-default-color-cell-foreground-muted',
        props.className
      )}
    >
      <Show when={state.hasSrLabel}>
        <span class="sr-only">{props.srLabel}</span>
      </Show>
      <span class="tabular-nums">{state.displayNo}</span>
    </td>
  );
}
