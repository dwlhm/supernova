import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableNoBodyCellProps {
  no?: number;
  className?: string;
}

export default function TableNoBodyCell(props: TableNoBodyCellProps) {
  useDefaultProps({
    no: 1,
    className: '',
  });

  return (
    <td
      class={cn(
        'w-12 whitespace-nowrap border-t border-components-table-default-color-divider-border-default px-4 py-3 text-center text-sm text-components-table-default-color-cell-foreground-muted',
        props.className
      )}
    >
      {props.no}
    </td>
  );
}
