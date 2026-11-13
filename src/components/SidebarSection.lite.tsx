import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn } from './utils';

export interface SidebarSectionProps {
  label?: string;
  expanded?: boolean;
  className?: string;
  children?: any;
}

export default function SidebarSection(props: SidebarSectionProps) {
  useDefaultProps({
    label: '',
    expanded: true,
    className: '',
  });

  return (
    <div
      class={cn(
        'flex w-full flex-col justify-start gap-1',
        props.expanded ? 'items-start' : 'items-center',
        props.className
      )}
    >
      <Show when={props.expanded && props.label !== ''}>
        <div class="flex flex-row items-center justify-start gap-2 px-2 py-1">
          <span class="text-xs font-medium text-foreground-muted">{props.label}</span>
        </div>
      </Show>
      <div
        class={cn(
          'flex w-full flex-col justify-start gap-1',
          props.expanded ? 'items-start' : 'items-center'
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
