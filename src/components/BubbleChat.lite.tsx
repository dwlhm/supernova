import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface BubbleChatProps {
  direction?: 'incoming' | 'outgoing';
  state?: 'default' | 'error';
  children?: any;
  className?: string;
}

export default function BubbleChat(props: BubbleChatProps) {
  useDefaultProps({
    direction: 'incoming',
    state: 'default',
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex w-full',
        props.direction === 'outgoing' ? 'justify-end' : 'justify-start',
        props.className
      )}
    >
      <div
        class={cn(
          'flex max-w-xs flex-col justify-start gap-1 rounded-2xl text-sm font-normal',
          props.direction === 'outgoing' ? 'items-end px-4 py-4' : 'items-start px-3 py-3',
          props.state === 'error'
            ? 'border border-destructive-border bg-destructive-subtle text-foreground-default'
            : props.direction === 'outgoing'
              ? 'border border-border-default bg-background-default text-foreground-default'
              : 'bg-background-muted text-foreground-default'
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
