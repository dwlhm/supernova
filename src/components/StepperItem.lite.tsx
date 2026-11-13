import { Show, useDefaultProps } from '@builder.io/mitosis';
import { cn } from './utils';
import StepperIndicator from './StepperIndicator.lite';
import StepperConnector from './StepperConnector.lite';

export interface StepperItemProps {
  index?: number;
  status?: 'completed' | 'active' | 'upcoming';
  orientation?: 'horizontal' | 'vertical' | 'responsive' | string;
  isLast?: boolean;
  className?: string;
  children?: any;
  onClick?: () => void;
}

export default function StepperItem(props: StepperItemProps) {
  useDefaultProps({
    index: 0,
    status: 'upcoming',
    orientation: 'horizontal',
    isLast: false,
    className: '',
  });

  return (
    <li
      aria-current={props.status === 'active' ? 'step' : undefined}
      class={cn(
        props.orientation === 'vertical' && 'flex w-full flex-col items-start',
        props.orientation === 'horizontal' &&
          'relative flex flex-1 flex-col items-center min-w-[4.5rem] sm:min-w-0 shrink-0 sm:shrink',
        props.orientation === 'responsive' &&
          'relative flex w-full flex-col items-start md:flex-1 md:items-center md:min-w-0 md:shrink',
        props.className
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => props.onClick && props.onClick()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && props.onClick && props.onClick()}
        class={cn(
          'relative z-10 flex cursor-pointer items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
          props.orientation === 'vertical' && 'flex-row',
          props.orientation === 'horizontal' && 'flex-col',
          props.orientation === 'responsive' && 'flex-row md:flex-col'
        )}
      >
        <StepperIndicator index={props.index} status={props.status} />
        <Show when={props.children}>
          <span
            class={cn(
              'font-body text-sm font-medium leading-5 px-1',
              props.orientation === 'vertical' && 'text-left',
              props.orientation === 'horizontal' && 'text-center whitespace-nowrap',
              props.orientation === 'responsive' && 'text-left md:text-center whitespace-nowrap',
              props.status === 'upcoming' ? 'text-foreground-muted' : 'text-foreground-default'
            )}
          >
            {props.children}
          </span>
        </Show>
      </div>
      <StepperConnector
        status={props.status}
        orientation={props.orientation}
        isLast={props.isLast}
      />
    </li>
  );
}
