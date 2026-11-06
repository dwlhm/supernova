import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface TableHeaderCellProps {
  align?: 'left' | 'center' | 'right';
  className?: string;
  children?: any;
}

export default function TableHeaderCell(props: TableHeaderCellProps) {
  useDefaultProps({
    align: 'left',
    className: '',
  });

  return (
    <th
      data-ctrl={typeof bindControllerProps}
      scope="col"
      class={cn(
        'px-4 py-3 text-sm font-medium text-foreground-muted',
        props.align === 'center' ? 'text-center' : props.align === 'right' ? 'text-right' : 'text-left',
        props.className
      )}
    >
      {props.children}
    </th>
  );
}