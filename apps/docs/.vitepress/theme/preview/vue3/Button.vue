<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :aria-disabled="disabled"
    :aria-label="ariaLabel || undefined"
    :class="
      cn(
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none',
        cva(
          variant,
          {
            primary:
              'bg-primary-default text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-pressed',
            secondary:
              'bg-secondary-default text-secondary-foreground shadow-xs hover:bg-secondary-hover active:bg-background-interactive focus-visible:bg-secondary-hover',
            outline:
              'border border-border-default bg-background-default text-foreground-default shadow-xs hover:bg-background-muted active:bg-background-interactive focus-visible:border-primary-border-emphasis',
            ghost:
              'bg-ghost-default text-foreground-default hover:bg-ghost-hover',
            destructive:
              'bg-destructive-background text-primary-foreground shadow-xs hover:bg-destructive-hover active:bg-destructive-pressed focus-visible:ring-focus-ring-error',
            link: 'bg-ghost-default text-primary-muted underline-offset-4 hover:underline hover:text-primary-on-surface',
          },
          'primary'
        ),
        cva(
          size,
          {
            large: 'h-10 px-6 text-base gap-2',
            regular: 'h-9 px-4 text-sm gap-2',
            small: 'h-8 px-3 text-sm gap-1.5',
            mini: 'h-6 px-2 text-xs gap-1.5',
          },
          'regular'
        ),
        roundness === 'round' ? 'rounded-full' : 'rounded-lg',
        className
      )
    "
    @click="async (event) => !disabled && onClick && onClick()"
  >
    <template v-if="showLeftIcon">
      <svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" :d="ICON_PATHS.plus"></path>
      </svg>
    </template>

    <slot />
    <template v-if="showRightIcon">
      <svg
        aria-hidden="true"
        class="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="ICON_PATHS.arrowRight"
        ></path>
      </svg>
    </template>
  </button>
</template>

<script setup lang="ts">
import { cn, cva, ICON_PATHS } from "./utils";

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "large" | "regular" | "small" | "mini";
  roundness?: "default" | "round";
  disabled?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  ariaLabel?: string;
  className?: string;

  onClick?: () => void;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: "button",
  disabled: false,
  ariaLabel: "",
  variant: "primary",
  size: "regular",
  roundness: "default",
  className: "",
  onClick: undefined,
  showLeftIcon: false,

  showRightIcon: false,
});
defineSlots<{ default?: () => any }>();
</script>