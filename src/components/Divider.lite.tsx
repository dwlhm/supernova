import { useDefaultProps } from '@builder.io/mitosis';
import { cn, cva } from './utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export default function Divider(props: DividerProps) {
  useDefaultProps({
    orientation: 'horizontal',
    className: '',
  });

  return (
    <div
      role="separator"
      aria-orientation={props.orientation}
      class={cn(
        'shrink-0 bg-border-default',
        cva(
          props.orientation,
          {
            horizontal: 'h-px w-full',
            vertical: 'h-full min-h-6 w-px self-stretch',
          },
          'horizontal'
        ),
        props.className
      )}
    />
  );
}
