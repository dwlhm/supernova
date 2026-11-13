import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface TableBodyRowProps {
  selected?: boolean;
  className?: string;
  children?: any;
}

export default function TableBodyRow(props: TableBodyRowProps) {
  useDefaultProps({
    selected: false,
    className: '',
  });

  return (
    <tr
      aria-selected={props.selected}
      class={cn(
        'border-b border-border-default transition-colors hover:bg-background-subtle',
        props.selected ? 'bg-primary-subtle' : 'bg-background-default',
        props.className,
      )}
    >
      {props.children}
    </tr>
  );
}
