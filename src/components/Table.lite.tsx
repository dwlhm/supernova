import { useDefaultProps, Show } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface TableProps {
  caption?: string;
  className?: string;
  children?: any;
}

export default function Table(props: TableProps) {
  useDefaultProps({
    caption: 'Data table',
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      class={cn('w-full overflow-x-auto rounded-lg border border-border-default bg-background-default', props.className)}
    >
      <table class="w-full border-collapse">
        <Show when={props.caption}>
          <caption class="sr-only">{props.caption}</caption>
        </Show>
        {props.children}
      </table>
    </div>
  );
}
