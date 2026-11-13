import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface TopbarProps {
  ariaLabel?: string;
  className?: string;
  children?: any;
}

export default function Topbar(props: TopbarProps) {
  useDefaultProps({
    ariaLabel: 'Application header',
    className: '',
  });

  return (
    <header
      aria-label={props.ariaLabel}
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex h-16 w-full flex-row items-center justify-start gap-2.5 border-b border-border-default bg-background-default px-4 py-3',
        props.className
      )}
    >
      {props.children}
    </header>
  );
}
