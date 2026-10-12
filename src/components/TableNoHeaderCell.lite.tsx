import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableNoHeaderCellProps {
  label?: string;
  className?: string;
}

export default function TableNoHeaderCell(props: TableNoHeaderCellProps) {
  useDefaultProps({
    label: 'No.',
    className: '',
  });

  return (
    <th
      scope="col"
      class={cn(
        'w-12 whitespace-nowrap bg-components-table-default-color-header-background-default px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-components-table-default-color-header-foreground-default',
        props.className
      )}
    >
      {props.label}
    </th>
  );
}
