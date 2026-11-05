import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableNoHeaderCellProps {
  label?: string;
  className?: string;
}

export default function TableNoHeaderCell(props: TableNoHeaderCellProps) {
  useDefaultProps({
    label: 'No',
    className: '',
  });

  return (
    <th
      scope="col"
      class={cn(
        'w-12 whitespace-nowrap bg-background-muted px-4 py-3 text-center text-sm font-medium text-foreground-default',
        props.className
      )}
    >
      {props.label}
    </th>
  );
}
