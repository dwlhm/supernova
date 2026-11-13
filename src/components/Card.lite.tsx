import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface CardProps {
  className?: string;
  children?: any;
}

export default function Card(props: CardProps) {
  useDefaultProps({
    className: '',
  });

  return (
    <article
      data-ctrl={typeof bindControllerProps}
      class={cn(
        'flex w-full flex-col gap-2 rounded-lg border border-border-default bg-background-default p-4 shadow-sm',
        props.className
      )}
    >
      {props.children}
    </article>
  );
}
