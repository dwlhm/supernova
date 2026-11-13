import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SidebarAccountProps {
  expanded?: boolean;
  className?: string;
  children?: any;
}

export default function SidebarAccount(props: SidebarAccountProps) {
  useDefaultProps({
    expanded: true,
    className: '',
  });

  return (
    <div
      class={cn(
        'flex w-full flex-col justify-start gap-2.5 px-2',
        props.expanded ? 'items-start' : 'h-12 items-center',
        props.className
      )}
    >
      <div
        class={cn(
          'flex flex-row items-center gap-2 rounded-xl bg-background-muted px-2 py-2',
          props.expanded ? 'w-full justify-start' : 'justify-center'
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
