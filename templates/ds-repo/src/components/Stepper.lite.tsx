import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface StepperProps {
  orientation?: 'horizontal' | 'vertical';
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
      class={cn('w-full bg-background-default', props.className)}
    >
      <ol
        class={cn(
          'flex items-start justify-start',
          props.orientation === 'vertical' ? 'flex-col' : 'w-full flex-row'
        )}
      >
        {props.children}
      </ol>
    </nav>
  );
}
