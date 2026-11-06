<template>
  <button
    type="button"
    :data-ctrl="typeof bindControllerProps"
    :aria-pressed="pressed"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex flex-row items-center justify-center rounded-lg text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50',
        showText
          ? cva(
              size,
              {
                small: 'px-2 py-1 gap-1.5 text-xs',
                medium: 'px-3 py-1.5 gap-2 text-sm',
                large: 'px-4 py-2 gap-2.5 text-base',
              },
              'medium'
            )
          : cva(
              size,
              {
                small: 'h-4 w-4 gap-0.5 px-0.5 py-0.5',
                medium: 'h-6 w-6 gap-1 px-1 py-1',
                large: 'h-9 w-9 gap-1 px-2 py-2',
              },
              'medium'
            ),
        pressed ? 'bg-background-muted shadow-sm' : 'bg-transparent',
        className
      )
    "
    @click="
      async (event) => !disabled && onPressedChange && onPressedChange(!pressed)
    "
  >
    <template v-if="showIcon">
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
                small: 'h-3 w-3',
                medium: 'h-4 w-4',
                large: 'h-5 w-5',
              },
              'medium'
            )
          )
        "
      >
        <path stroke-linecap="round" :d="ICON_PATHS.plus"></path>
      </svg>
    </template>

    <template v-if="$slots.default">
      <span class="truncate font-medium"><slot /></span>
    </template>
  </button>
</template>

<script setup lang="ts">
import { cn, cva, ICON_PATHS, bindControllerProps } from "./utils";

export interface ToggleProps {
  pressed?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  showText?: boolean;
  showIcon?: boolean;
  className?: string;

  ariaLabel?: string;
  onPressedChange?: (pressed: boolean) => void;
}

const props = withDefaults(defineProps<ToggleProps>(), {
  pressed: false,
  ariaLabel: "Toggle",
  disabled: false,
  showText: false,
  size: "medium",
  className: "",
  onPressedChange: undefined,
  showIcon: true,
});
defineSlots<{ default?: () => any }>();
</script>