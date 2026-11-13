import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SidebarNavProps {
  expanded?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: any;
}

export default function SidebarNav(props: SidebarNavProps) {
  useDefaultProps({
    expanded: true,
    ariaLabel: 'Main',
    className: '',
  });

  return (
    <nav
      aria-label={props.ariaLabel}
      class={cn(
        'flex w-full flex-1 flex-col justify-start gap-2 px-2 py-2',
        props.expanded ? 'items-start' : 'items-center',
        props.className
      )}
    >
      {props.children}
    </nav>
  );
}
