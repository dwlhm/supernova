import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableNoHeaderCellProps {
  /**
   * Header label for the row-number column. Defaults to "No".
   */
  children?: any;
  className?: string;
}

/**
 * Compact header cell for the row-number column.
 * Use above TableNoBodyCell when the table displays numbered rows.
 */
export default function TableNoHeaderCell(props: TableNoHeaderCellProps) {
  useDefaultProps({
    className: '',
  });

  return (
    <th
      scope="col"
      class={cn(
        'w-12 whitespace-nowrap px-4 py-3 text-center align-middle text-sm font-medium leading-normal text-components-table-default-color-header-foreground-default',
        props.className
      )}
    >
      {props.children ? props.children : 'No'}
    </th>
  );
}
