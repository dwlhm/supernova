import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface BubbleChatFooterProps {
  align?: 'end' | 'between';
  children?: any;
  className?: string;
}

export default function BubbleChatFooter(props: BubbleChatFooterProps) {
  useDefaultProps({
    align: 'end',
    className: '',
  });

  return (
    <div
      class={cn(
        'flex w-full flex-row items-center gap-1 text-xs font-normal text-foreground-muted',
        props.align === 'between' ? 'justify-between' : 'justify-end',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
