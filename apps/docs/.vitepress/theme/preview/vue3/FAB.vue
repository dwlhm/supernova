<template>
  <button
    :type="type || 'button'"
    :aria-label="ariaLabel || label || 'Action'"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex shrink-0 items-center justify-center rounded-full shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50',
        cva(
          variant,
          {
            primary:
              'bg-primary-default text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed',
            secondary:
              'bg-secondary-default text-secondary-foreground hover:bg-secondary-hover active:bg-background-interactive',
            outline:
              'border border-border-default bg-background-default text-foreground-default hover:bg-background-muted active:bg-background-interactive',
          },
          'primary'
        ),
        cva(
          size,
          {
            small: 'h-10 w-10',
            regular: 'h-14 w-14',
            large: 'h-24 w-24',
            extended: 'h-14 w-auto gap-3 px-4',
          },
          'small'
        ),
        className
      )
    "
    @click="async (event) => !disabled && onClick && onClick()"
  >
    <template v-if="$slots.default">
      <slot />
    </template>

    <template v-if="!$slots.default">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        :class="
          cn(
            'shrink-0',
            cva(
              size,
              {
                small: 'h-4 w-4',
                regular: 'h-5 w-5',
                large: 'h-7 w-7',
                extended: 'h-5 w-5',
              },
              'small'
            )
          )
        "
      >
        <path stroke-linecap="round" :d="ICON_PATHS.plus"></path>
      </svg>
    </template>

    <template v-if="size === 'extended' && showLabel">
      <span class="truncate text-sm font-medium">{{ label }}</span>
    </template>
  </button>
</template>

<script setup lang="ts">
import { cn, cva, ICON_PATHS } from "./utils";

export interface FABProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "regular" | "large" | "extended";
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
  ariaLabel?: string;
  className?: string;

  onClick?: () => void;
}

const props = withDefaults(defineProps<FABProps>(), {
  type: "button",
  ariaLabel: "",
  label: "Label",
  disabled: false,
  variant: "primary",
  size: "small",
  className: "",
  onClick: undefined,

  showLabel: true,
});
defineSlots<{ default?: () => any }>();
</script>