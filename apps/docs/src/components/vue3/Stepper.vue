<template>
  <nav :aria-label="ariaLabel" :class="cn('w-full', className)">
    <template v-if="orientation === 'vertical'">
      <ol class="flex flex-col">
        <template :key="index" v-for="(step, index) in steps">
          <li class="flex gap-2">
            <div class="flex flex-col items-center gap-1">
              <span
                :class="
                  cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full text-sm',
                    indicatorClasses(index)
                  )
                "
                :aria-current="index + 1 === current ? 'step' : undefined"
              >
                <template v-if="index + 1 < current">
                  <svg
                    aria-hidden="true"
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </template>

                <template v-if="index + 1 >= current">
                  {{ index + 1 }}
                </template>
              </span>
              <template v-if="!isLast(index)">
                <span
                  aria-hidden="true"
                  :class="cn('w-0.5 flex-1', connectorClasses(index))"
                ></span>
              </template>
            </div>
            <span :class="cn('pb-6 pt-1.5 text-sm', labelClasses(index))">{{
              step
            }}</span>
          </li>
        </template>
      </ol>
    </template>

    <template v-if="orientation === 'horizontal'">
      <ol class="flex w-full items-start">
        <template :key="index" v-for="(step, index) in steps">
          <li class="flex flex-1 flex-col items-center gap-2">
            <div class="flex w-full items-center">
              <span
                aria-hidden="true"
                :class="
                  cn(
                    'h-0.5 flex-1',
                    index === 0 ? 'bg-transparent' : connectorClasses(index - 1)
                  )
                "
              ></span
              ><span
                :class="
                  cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full text-sm',
                    indicatorClasses(index)
                  )
                "
                :aria-current="index + 1 === current ? 'step' : undefined"
              >
                <template v-if="index + 1 < current">
                  <svg
                    aria-hidden="true"
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </template>

                <template v-if="index + 1 >= current">
                  {{ index + 1 }}
                </template> </span
              ><span
                aria-hidden="true"
                :class="
                  cn(
                    'h-0.5 flex-1',
                    isLast(index) ? 'bg-transparent' : connectorClasses(index)
                  )
                "
              ></span>
            </div>
            <span :class="cn('text-center text-sm', labelClasses(index))">{{
              step
            }}</span>
          </li>
        </template>
      </ol>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { cn } from "./utils";

export interface StepperProps {
  orientation?: "horizontal" | "vertical";
  current?: number;
  steps?: string[];
  ariaLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<StepperProps>(), {
  current: 1,
  steps: ["Cart", "Shipping", "Payment", "Review"],
  ariaLabel: "Progress",
  className: "",
  orientation: "horizontal",
});

function indicatorClasses(index: number) {
  const position = index + 1;
  const activeStep = props.current;
  if (position < activeStep) {
    return "bg-success-subtle text-success-foreground border border-success-default";
  }
  if (position === activeStep) {
    return "bg-components-stepper-default-color-indicator-background-active text-components-stepper-default-color-indicator-content-active";
  }
  return "bg-components-stepper-default-color-indicator-background-upcoming text-components-stepper-default-color-indicator-content-upcoming";
}
function labelClasses(index: number) {
  const position = index + 1;
  const activeStep = props.current;
  if (position < activeStep) {
    return "text-components-stepper-default-color-label-text-completed font-medium";
  }
  if (position === activeStep) {
    return "text-components-stepper-default-color-label-text-active font-semibold";
  }
  return "text-components-stepper-default-color-label-text-upcoming";
}
function connectorClasses(index: number) {
  const position = index + 1;
  const activeStep = props.current;
  if (position < activeStep) {
    return "bg-components-stepper-default-color-connector-background-completed";
  }
  return "bg-components-stepper-default-color-connector-background-upcoming";
}
function isLast(index: number) {
  return index === props.steps.length - 1;
}
</script>