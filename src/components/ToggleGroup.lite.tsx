import { useDefaultProps } from '@builder.io/mitosis';
import { cn, cva, handleGroupKeyDown, bindControllerProps } from './utils';

export interface ToggleGroupProps {
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
  className?: string;
  children?: any;
}

export default function ToggleGroup(props: ToggleGroupProps) {
  useDefaultProps({
    size: 'medium',
    ariaLabel: 'Toggle group',
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      data-size={props.size}
      role="group"
      aria-label={props.ariaLabel}
      onKeyDown={(event) => handleGroupKeyDown(event)}
      class={cn(
        'inline-flex flex-row justify-start items-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm [&_button]:rounded-none [&_button]:shadow-none [&>button:not(:last-child)]:border-r [&>button:not(:last-child)]:border-border-default [&>*:not(:last-child)>button]:border-r [&>*:not(:last-child)>button]:border-border-default',
        cva(
          props.size,
          {
            small: 'min-h-5',
            medium: 'min-h-6',
            large: 'min-h-9',
          },
          'medium'
        ),
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
