import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface TopbarContentProps {
  className?: string;
  children?: any;
}

export default function TopbarContent(props: TopbarContentProps) {
  useDefaultProps({
    className: '',
  });

  return (
    <div
      data-ctrl={typeof bindControllerProps}
      class={cn('ml-auto flex flex-1 items-center justify-end gap-2.5', props.className)}
    >
      {props.children}
    </div>
  );
}
