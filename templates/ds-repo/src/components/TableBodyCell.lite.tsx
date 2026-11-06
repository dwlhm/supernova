import { useDefaultProps } from '@builder.io/mitosis';
import { cn, cva, bindControllerProps } from './utils';

export interface TableBodyCellProps {
  align?: 'left' | 'center' | 'right';
  className?: string;
  children?: any;
}

export default function TableBodyCell(props: TableBodyCellProps) {
  useDefaultProps({
    align: 'left',
    className: '',
  });

  return (
    <td
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'border-t border-border-default px-4 py-3 align-middle text-sm font-normal text-foreground-default',
        cva(props.align, { left: 'text-left', center: 'text-center', right: 'text-right' }, 'left'),
        props.className
      )}
    >
      {props.children}
    </td>
  );
}
