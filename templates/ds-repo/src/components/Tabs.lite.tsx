import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface TabsProps {
  ariaLabel?: string;
  className?: string;
  children?: any;
}

export default function Tabs(props: TabsProps) {
  useDefaultProps({
    ariaLabel: 'Tabs',
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      role="tablist"
      aria-label={props.ariaLabel}
      class={cn(
        'inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
