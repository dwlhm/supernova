<template>
  <li
    :class="
      cn(
        'flex items-start justify-start',
        orientation === 'vertical'
          ? 'flex-col'
          : !isLast
          ? 'flex-1 flex-row'
          : 'flex-row',
        className
      )
    "
  >
    <div
      :class="
        cn(
          'flex items-center justify-start gap-2',
          orientation === 'vertical' ? 'flex-row' : 'flex-col'
        )
      "
    >
      <span
        :class="
          cn(
            'flex h-8 w-8 shrink-0 flex-row items-center justify-center rounded-full text-center text-xs font-semibold',
            cva(
              status,
              {
                completed: 'bg-success-subtle text-success-foreground',
                active: 'bg-primary-default text-primary-foreground',
                upcoming: 'bg-background-muted text-foreground-muted',
              },
              'upcoming'
            )
          )
        "
        :aria-current="status === 'active' ? 'step' : undefined"
      >
        <template v-if="status === 'completed'">
          <svg
            aria-hidden="true"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              :d="ICON_PATHS.check"
            ></path>
          </svg>
        </template>

        <template v-if="status !== 'completed'">
          {{ step }}
        </template> </span
      ><span
        :class="
          cn(
            'text-sm',
            orientation === 'horizontal' && 'text-center',
            cva(
              status,
              {
                completed: 'font-medium text-foreground-default',
                active: 'font-semibold text-foreground-default',
                upcoming: 'font-medium text-foreground-muted',
              },
              'upcoming'
            )
          )
        "
        ><slot
      /></span>
    </div>
    <template v-if="!isLast">
      <div
        aria-hidden="true"
        :class="
          cn(
            'flex items-center justify-center',
            orientation === 'vertical'
              ? 'h-8 w-8 flex-row'
              : 'h-8 flex-1 flex-col'
          )
        "
      >
        <span
          :class="
            cn(
              orientation === 'vertical' ? 'h-8 w-0.5' : 'h-0.5 w-full',
              status === 'completed'
                ? 'bg-success-foreground'
                : 'bg-border-default'
            )
          "
        ></span>
      </div>
    </template>
  </li>
</template>

<script setup lang="ts">
import { cn, cva, ICON_PATHS } from "./utils";

export interface StepperItemProps {
  step?: number;
  status?: "completed" | "active" | "upcoming";
  orientation?: "horizontal" | "vertical";
  isLast?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<StepperItemProps>(), {
  orientation: "horizontal",
  isLast: false,
  className: "",
  status: "upcoming",
  step: 1,
});
defineSlots<{ default?: () => any }>();
</script>