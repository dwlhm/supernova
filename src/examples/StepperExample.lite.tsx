import { For, useStore } from '@builder.io/mitosis';
import Stepper from '../components/Stepper.lite';
import StepperItem from '../components/StepperItem.lite';
import { cn } from '../components/utils';

export default function StepperExample() {
  const state = useStore({
    activeStep: 1,
    orientation: 'responsive' as 'horizontal' | 'vertical' | 'responsive' | string,
    steps: ['Cart', 'Shipping', 'Payment', 'Review', 'Step 5', 'Step 6'],
  });

  return (
    <div class="flex w-full flex-col gap-4">
      <div class="flex flex-wrap items-center justify-end gap-1.5">
        <button
          type="button"
          class={cn(
            'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            state.orientation === 'responsive'
              ? 'border-primary-default bg-primary-default text-primary-foreground'
              : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default'
          )}
          onClick={() => {
            state.orientation = 'responsive';
          }}
        >
          Responsive (Auto)
        </button>
        <button
          type="button"
          class={cn(
            'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            state.orientation === 'horizontal'
              ? 'border-primary-default bg-primary-default text-primary-foreground'
              : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default'
          )}
          onClick={() => {
            state.orientation = 'horizontal';
          }}
        >
          Horizontal
        </button>
        <button
          type="button"
          class={cn(
            'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            state.orientation === 'vertical'
              ? 'border-primary-default bg-primary-default text-primary-foreground'
              : 'border-border-default bg-background-default text-foreground-muted hover:text-foreground-default'
          )}
          onClick={() => {
            state.orientation = 'vertical';
          }}
        >
          Vertical
        </button>
      </div>
      <Stepper orientation={state.orientation} ariaLabel="Checkout progress">
        <For each={state.steps}>
          {(label, index) => (
            <StepperItem
              key={index}
              index={index}
              status={state.activeStep > index ? 'completed' : state.activeStep === index ? 'active' : 'upcoming'}
              orientation={state.orientation}
              isLast={index === 5}
              onClick={() => {
                state.activeStep = index;
              }}
            >
              {label}
            </StepperItem>
          )}
        </For>
      </Stepper>
    </div>
  );
}
