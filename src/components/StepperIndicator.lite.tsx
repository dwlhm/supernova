import { Show, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';

export interface StepperIndicatorProps {
  index?: number;
  status?: 'completed' | 'active' | 'upcoming';
  icon?: any;
  className?: string;
}

export default function StepperIndicator(props: StepperIndicatorProps) {
  useDefaultProps({
    index: 0,
    status: 'upcoming',
    className: '',
  });

  return (
    <div
      class={cn(
        'flex h-8 w-8 shrink-0 flex-row items-center justify-center rounded-full font-body text-xs font-semibold leading-4',
        props.status === 'completed' && 'bg-success-subtle text-success-foreground',
        props.status === 'active' && 'bg-primary-default text-primary-foreground',
        (props.status === 'upcoming' || !props.status) &&
          'bg-background-muted text-foreground-muted',
        props.className
      )}
    >
      {props.icon}
      <Show when={!props.icon && props.status === 'completed'}>
        <svg
          class="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M13.3334 4L6.00008 11.3333L2.66675 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Show>
      <Show when={!props.icon && props.status !== 'completed'}>
        <span class="text-center">{(props.index ?? 0) + 1}</span>
      </Show>
    </div>
  );
}
