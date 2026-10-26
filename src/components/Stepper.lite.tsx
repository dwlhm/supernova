import { useStore, useDefaultProps, Show, For } from '@builder.io/mitosis';
import { cn } from './utils';

type StepperStatus = 'completed' | 'active' | 'upcoming';

interface StepperStep {
  id: string;
  label: string;
  number: number;
  status: StepperStatus;
  isLast: boolean;
}

export interface StepperProps {
  type?: 'Horizontal' | 'Vertical';
  current?: '1' | '2' | '3' | '4';
  step1Label?: string;
  step2Label?: string;
  step3Label?: string;
  step4Label?: string;
  className?: string;
}

export default function Stepper(props: StepperProps) {
  useDefaultProps({
    type: 'Horizontal',
    current: '1',
    step1Label: 'Cart',
    step2Label: 'Shipping',
    step3Label: 'Payment',
    step4Label: 'Review',
    className: '',
  });

  const state = useStore({
    get isVertical() {
      return props.type === 'Vertical';
    },
    get steps() {
      const labels: string[] = [
        props.step1Label || '',
        props.step2Label || '',
        props.step3Label || '',
        props.step4Label || '',
      ];
      const currentStep = Number(props.current) || 1;
      const lastIndex = labels.length - 1;

      return labels.map((label: string, index: number) => {
        const stepNumber = index + 1;
        let status: StepperStatus = 'upcoming';
        if (stepNumber < currentStep) {
          status = 'completed';
        } else if (stepNumber === currentStep) {
          status = 'active';
        }
        return {
          id: 'step-' + stepNumber,
          label,
          number: stepNumber,
          status,
          isLast: index === lastIndex,
        };
      });
    },
    get containerClasses() {
      return cn(
        'flex rounded-md bg-background-default px-5 py-5',
        state.isVertical ? 'flex-col items-start' : 'w-full flex-row items-start',
        props.className
      );
    },
    itemClasses(isLast) {
      if (state.isVertical) {
        return 'flex flex-col items-start';
      }
      return cn('flex flex-row items-start', isLast ? 'shrink-0' : 'flex-1');
    },
    get stepContentClasses() {
      if (state.isVertical) {
        return 'flex flex-row items-center gap-2';
      }
      return 'flex w-16 shrink-0 flex-col items-center gap-2';
    },
    indicatorClasses(status) {
      return cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
        status === 'completed' &&
          'bg-components-stepper-default-color-indicator-background-completed text-components-stepper-default-color-icon-stroke-completed',
        status === 'active' &&
          'bg-components-stepper-default-color-indicator-background-active text-components-stepper-default-color-indicator-content-active',
        status === 'upcoming' &&
          'bg-components-stepper-default-color-indicator-background-upcoming text-components-stepper-default-color-indicator-content-upcoming'
      );
    },
    get labelBaseClasses() {
      const alignment = state.isVertical ? 'text-left' : 'w-full text-center';
      return cn('min-w-0 text-xs leading-tight', alignment);
    },
    labelStateClasses(status) {
      if (status === 'upcoming') {
        return cn(
          'font-medium text-components-stepper-default-color-label-text-upcoming',
          state.labelBaseClasses
        );
      }
      if (status === 'active') {
        return cn(
          'font-semibold text-components-stepper-default-color-label-text-active',
          state.labelBaseClasses
        );
      }
      return cn(
        'font-medium text-components-stepper-default-color-label-text-completed',
        state.labelBaseClasses
      );
    },
    get connectorWrapperClasses() {
      if (state.isVertical) {
        return 'flex w-8 shrink-0 justify-center';
      }
      return 'flex h-8 flex-1 items-center px-2';
    },
    get connectorBaseClasses() {
      return cn('rounded-full', state.isVertical ? 'h-8 w-0.5' : 'h-0.5 w-full');
    },
    connectorStateClasses(status) {
      return status === 'completed'
        ? 'bg-components-stepper-default-color-connector-background-completed'
        : 'bg-components-stepper-default-color-connector-background-upcoming';
    },
    statusText(status) {
      if (status === 'completed') {
        return 'Completed:';
      }
      if (status === 'active') {
        return 'Current:';
      }
      return 'Upcoming:';
    },
  });

  return (
    <ol class={state.containerClasses}>
      <For each={state.steps}>
        {(item: StepperStep) => (
          <li key={item.id} class={state.itemClasses(item.isLast)}>
            <div class={state.stepContentClasses}>
              <span
                class={state.indicatorClasses(item.status)}
                aria-current={item.status === 'active' ? 'step' : 'false'}
              >
                <Show when={item.status === 'completed'}>
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                </Show>
                <Show when={item.status !== 'completed'}>
                  <span class="leading-none">{item.number}</span>
                </Show>
              </span>
              <span class={state.labelStateClasses(item.status)}>
                <span class="sr-only">{state.statusText(item.status)} </span>
                {item.label}
              </span>
            </div>
            <Show when={!item.isLast}>
              <div class={state.connectorWrapperClasses} aria-hidden="true">
                <span
                  class={cn(state.connectorBaseClasses, state.connectorStateClasses(item.status))}
                />
              </div>
            </Show>
          </li>
        )}
      </For>
    </ol>
  );
}
