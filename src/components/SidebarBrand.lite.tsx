import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SidebarBrandProps {
  expanded?: boolean;
  className?: string;
  children?: any;
}

export default function SidebarBrand(props: SidebarBrandProps) {
  useDefaultProps({
    expanded: true,
    className: '',
  });

  return (
    <div
      class={cn(
        'flex w-full flex-row items-center gap-2',
        props.expanded ? 'justify-start px-2 py-4' : 'justify-center px-2 pt-4 pb-2',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
