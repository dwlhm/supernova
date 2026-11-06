import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface TableHeaderRowProps {
  className?: string;
  children?: any;
}

export default function TableHeaderRow(props: TableHeaderRowProps) {
  useDefaultProps({
    className: '',
  });

  return (
    <tr
      data-ctrl={typeof bindControllerProps}
      class={cn('border-b border-border-default bg-background-subtle', props.className)}
    >
      {props.children}
    </tr>
  );
}