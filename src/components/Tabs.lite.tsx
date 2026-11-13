import { useDefaultProps } from '@builder.io/mitosis';
import { cn, handleGroupKeyDown } from './utils';

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
      role="tablist"
      aria-label={props.ariaLabel}
      onKeyDown={(event) => handleGroupKeyDown(event)}
      class={cn(
        'inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
