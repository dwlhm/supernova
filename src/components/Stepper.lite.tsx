import { useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn, cva, getStepperStepState, ICON_PATHS, bindControllerProps } from './utils';

export interface StepperProps {
  orientation?: 'horizontal' | 'vertical';
  current?: number;
  steps?: string[];
  ariaLabel?: string;
  className?: string;
  children?: any;
}

export default function Stepper(props: StepperProps) {
  useDefaultProps({
    orientation: 'horizontal',
    current: 2,
    steps: ['Cart', 'Shipping', 'Payment', 'Review', 'Step 5', 'Step 6'],
    ariaLabel: 'Progress',
    className: '',
  });

  return (
    <nav data-ctrl={typeof bindControllerProps} aria-label={props.ariaLabel} class={cn('w-full bg-background-default', props.className)}>
      <Show when={props.children}>{props.children}</Show>
      <Show when={!props.children && props.orientation === 'vertical'}>
        <ol class="flex flex-col items-start">
          <For each={props.steps}>
            {(step, index) => (
              <li key={index} class="flex flex-col items-start">
                <div class="flex items-center gap-2">
                  <span
                    class={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      cva(
                        getStepperStepState(index, props.current, (props.steps || []).length).stepKey,
                        {
                          completed: 'bg-success-subtle text-success-foreground',
                          active: 'bg-primary-default text-primary-foreground',
                          upcoming: 'bg-background-muted text-foreground-muted',
                        },
                        'upcoming'
                      )
                    )}
                    aria-current={getStepperStepState(index, props.current, (props.steps || []).length).isCurrent ? 'step' : undefined}
                  >
                    <Show when={getStepperStepState(index, props.current, (props.steps || []).length).isCompleted}>
                      <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d={ICON_PATHS.check} stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </Show>
                    <Show when={!getStepperStepState(index, props.current, (props.steps || []).length).isCompleted}>{index + 1}</Show>
                  </span>
                  <span
                    class={cn(
                      'text-sm',
                      cva(
                        getStepperStepState(index, props.current, (props.steps || []).length).stepKey,
                        {
                          completed: 'font-medium text-foreground-default',
                          active: 'font-semibold text-foreground-default',
                          upcoming: 'font-medium text-foreground-muted',
                        },
                        'upcoming'
                      )
                    )}
                  >
                    {step}
                  </span>
                </div>
                <Show when={!getStepperStepState(index, props.current, (props.steps || []).length).isLast}>
                  <div class="flex h-8 w-8 items-center justify-center" aria-hidden="true">
                    <span
                      class={cn(
                        'h-full w-0.5',
                        getStepperStepState(index, props.current, (props.steps || []).length).isCompleted ? 'bg-success-foreground' : 'bg-border-default'
                      )}
                    />
                  </div>
                </Show>
              </li>
            )}
          </For>
        </ol>
      </Show>
      <Show when={!props.children && props.orientation === 'horizontal'}>
        <ol class="flex w-full items-start">
          <For each={props.steps}>
            {(step, index) => (
              <li key={index} class="flex flex-1 flex-col items-center gap-2">
                <div class="flex w-full items-center">
                  <span
                    class={cn(
                      'h-0.5 flex-1',
                      index === 0
                        ? 'bg-transparent'
                        : getStepperStepState(index, props.current, (props.steps || []).length).prevCompleted
                          ? 'bg-success-foreground'
                          : 'bg-border-default'
                    )}
                    aria-hidden="true"
                  />
                  <span
                    class={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      cva(
                        getStepperStepState(index, props.current, (props.steps || []).length).stepKey,
                        {
                          completed: 'bg-success-subtle text-success-foreground',
                          active: 'bg-primary-default text-primary-foreground',
                          upcoming: 'bg-background-muted text-foreground-muted',
                        },
                        'upcoming'
                      )
                    )}
                    aria-current={getStepperStepState(index, props.current, (props.steps || []).length).isCurrent ? 'step' : undefined}
                  >
                    <Show when={getStepperStepState(index, props.current, (props.steps || []).length).isCompleted}>
                      <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d={ICON_PATHS.check} stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </Show>
                    <Show when={!getStepperStepState(index, props.current, (props.steps || []).length).isCompleted}>{index + 1}</Show>
                  </span>
                  <span
                    class={cn(
                      'h-0.5 flex-1',
                      getStepperStepState(index, props.current, (props.steps || []).length).isLast
                        ? 'bg-transparent'
                        : getStepperStepState(index, props.current, (props.steps || []).length).isCompleted
                          ? 'bg-success-foreground'
                          : 'bg-border-default'
                    )}
                    aria-hidden="true"
                  />
                </div>
                <span
                  class={cn(
                    'text-center text-sm',
                    cva(
                      getStepperStepState(index, props.current, (props.steps || []).length).stepKey,
                      {
                        completed: 'font-medium text-foreground-default',
                        active: 'font-semibold text-foreground-default',
                        upcoming: 'font-medium text-foreground-muted',
                      },
                      'upcoming'
                    )
                  )}
                >
                  {step}
                </span>
              </li>
            )}
          </For>
        </ol>
      </Show>
    </nav>
  );
}
