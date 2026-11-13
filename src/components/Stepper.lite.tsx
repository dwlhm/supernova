import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface StepperProps {
  orientation?: 'horizontal' | 'vertical' | 'responsive' | string;
  ariaLabel?: string;
  className?: string;
  children?: any;
}

export default function Stepper(props: StepperProps) {
  useDefaultProps({
    orientation: 'horizontal',
    ariaLabel: 'Progress',
    className: '',
  });

  return (
    <nav
      data-ctrl={typeof bindControllerProps}
      aria-label={props.ariaLabel}
      class={cn(
        'w-full bg-background-default',
        props.orientation !== 'vertical' && 'overflow-x-auto py-1',
        props.className
      )}
    >
      <ol
        class={cn(
          'flex items-start justify-start',
          props.orientation === 'vertical' && 'w-full flex-col',
          props.orientation === 'horizontal' && 'w-full min-w-max flex-row sm:min-w-full',
          props.orientation === 'responsive' && 'w-full flex-col md:min-w-full md:flex-row'
        )}
      >
        {props.children}
      </ol>
    </nav>
  );
}
