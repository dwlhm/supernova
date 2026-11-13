import { useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface CardFooterProps {
  className?: string;
  children?: any;
}

export default function CardFooter(props: CardFooterProps) {
  useDefaultProps({
    className: '',
  });

  return (
    <div class={cn('flex flex-wrap items-center gap-2 pt-1', props.className)}>
      {props.children}
    </div>
  );
}
