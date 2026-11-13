import { Show, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface StepperConnectorProps {
  status?: 'completed' | 'active' | 'upcoming';
  orientation?: 'horizontal' | 'vertical' | 'responsive' | string;
  isLast?: boolean;
  className?: string;
}

export default function StepperConnector(props: StepperConnectorProps) {
  useDefaultProps({
    status: 'upcoming',
    orientation: 'horizontal',
    isLast: false,
    className: '',
  });

  return (
    <Show when={!props.isLast}>
      <Show when={props.orientation !== 'vertical'}>
        <div
          aria-hidden="true"
          class={cn(
            'absolute top-4 left-1/2 -translate-y-1/2 w-full h-0.5',
            props.orientation === 'responsive' && 'hidden md:block',
            props.className
          )}
        >
          <div
            class={cn(
              'h-full w-full',
              props.status === 'completed' ? 'bg-success-foreground' : 'bg-border-default'
            )}
          />
        </div>
      </Show>
      <Show when={props.orientation !== 'horizontal'}>
        <div
          aria-hidden="true"
          class={cn(
            'h-8 w-8 flex-row items-center justify-center',
            props.orientation === 'vertical' ? 'flex' : 'flex md:hidden',
            props.className
          )}
        >
          <div
            class={cn(
              'h-8 w-0.5',
              props.status === 'completed' ? 'bg-success-foreground' : 'bg-border-default'
            )}
          />
        </div>
      </Show>
    </Show>
  );
}
