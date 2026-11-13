import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

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
      class={cn(
        'border-b border-border-default bg-background-muted',
        props.className,
      )}
    >
      {props.children}
    </tr>
  );
}
