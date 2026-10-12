import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

export interface StepperProps {
  orientation?: 'horizontal' | 'vertical';
  current?: number;
  steps?: string[];
  ariaLabel?: string;
  className?: string;
}

export default function Stepper(props: StepperProps) {
  useDefaultProps({
    orientation: 'horizontal',
    current: 1,
    steps: ['Cart', 'Shipping', 'Payment', 'Review'],
    ariaLabel: 'Progress',
    className: '',
  });

  const state = useStore({
    indicatorClasses(index: number) {
      const position = index + 1;
      const activeStep = props.current;
      if (position < activeStep) {
        return 'bg-success-subtle text-success-foreground border border-success-default';
      }
      if (position === activeStep) {
        return 'bg-components-stepper-default-color-indicator-background-active text-components-stepper-default-color-indicator-content-active';
      }
      return 'bg-components-stepper-default-color-indicator-background-upcoming text-components-stepper-default-color-indicator-content-upcoming';
    },
    labelClasses(index: number) {
      const position = index + 1;
      const activeStep = props.current;
      if (position < activeStep) {
        return 'text-components-stepper-default-color-label-text-completed font-medium';
      }
      if (position === activeStep) {
        return 'text-components-stepper-default-color-label-text-active font-semibold';
      }
      return 'text-components-stepper-default-color-label-text-upcoming';
    },
    connectorClasses(index: number) {
      const position = index + 1;
      const activeStep = props.current;
      if (position < activeStep) {
        return 'bg-components-stepper-default-color-connector-background-completed';
      }
      return 'bg-components-stepper-default-color-connector-background-upcoming';
    },
    isLast(index: number) {
      return index === props.steps.length - 1;
    },
  });

  return (
    <nav aria-label={props.ariaLabel} class={cn('w-full', props.className)}>
      <Show when={props.orientation === 'vertical'}>
        <ol class="flex flex-col">
          <For each={props.steps}>
            {(step, index) => (
              <li key={index} class="flex gap-2">
                <div class="flex flex-col items-center gap-1">
                  <span
                    class={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full text-sm',
                      state.indicatorClasses(index)
                    )}
                    aria-current={index + 1 === props.current ? 'step' : undefined}
                  >
                    <Show when={index + 1 < props.current}>
                      <svg
                        aria-hidden="true"
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </Show>
                    <Show when={index + 1 >= props.current}>{index + 1}</Show>
                  </span>
                  <Show when={!state.isLast(index)}>
                    <span
                      class={cn('w-0.5 flex-1', state.connectorClasses(index))}
                      aria-hidden="true"
                    />
                  </Show>
                </div>
                <span class={cn('pb-6 pt-1.5 text-sm', state.labelClasses(index))}>{step}</span>
              </li>
            )}
          </For>
        </ol>
      </Show>
      <Show when={props.orientation === 'horizontal'}>
        <ol class="flex w-full items-start">
          <For each={props.steps}>
            {(step, index) => (
              <li key={index} class="flex flex-1 flex-col items-center gap-2">
                <div class="flex w-full items-center">
                  <span
                    class={cn(
                      'h-0.5 flex-1',
                      index === 0 ? 'bg-transparent' : state.connectorClasses(index - 1)
                    )}
                    aria-hidden="true"
                  />
                  <span
                    class={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full text-sm',
                      state.indicatorClasses(index)
                    )}
                    aria-current={index + 1 === props.current ? 'step' : undefined}
                  >
                    <Show when={index + 1 < props.current}>
                      <svg
                        aria-hidden="true"
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </Show>
                    <Show when={index + 1 >= props.current}>{index + 1}</Show>
                  </span>
                  <span
                    class={cn(
                      'h-0.5 flex-1',
                      state.isLast(index) ? 'bg-transparent' : state.connectorClasses(index)
                    )}
                    aria-hidden="true"
                  />
                </div>
                <span class={cn('text-center text-sm', state.labelClasses(index))}>{step}</span>
              </li>
            )}
          </For>
        </ol>
      </Show>
    </nav>
  );
}
