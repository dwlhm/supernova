import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface SidebarProps {
  expanded?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: any;
}

export default function Sidebar(props: SidebarProps) {
  useDefaultProps({
    expanded: true,
    ariaLabel: 'Sidebar',
    className: '',
  });

  return (
    <aside
      data-ctrl={typeof bindControllerProps}
      data-expanded={props.expanded ? 'true' : 'false'}
      aria-label={props.ariaLabel}
      class={cn(
        'flex h-full shrink-0 flex-col justify-between border-r border-border-default bg-background-default pt-0 pb-2',
        props.expanded ? 'w-60 items-start' : 'w-16 items-center',
        props.className
      )}
    >
      {props.children}
    </aside>
  );
}
