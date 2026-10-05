<template>
  <button
    @click="async (event) => dispatchEvent(onClick, event, disabled)"
    :type="type || 'button'"
    :disabled="disabled"
    :class="
      'inline-flex items-center justify-center font-medium transition-colors duration-150 border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed' +
      ' ' +
      (fullWidth ? 'w-full' : 'w-auto') +
      ' ' +
      sizeClass +
      ' ' +
      variantClass
    "
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import {
  resolveVariantClass,
  dispatchEvent,
} from "./runtime/component-runtime";

// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

export interface ButtonProps {
  children?: any;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (event: any) => void;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  size: "md",
  variant: "primary",
  onClick: undefined,
  disabled: false,
  type: "button",
  fullWidth: false,
  children: undefined,
});

const sizeClass = computed(() => {
  return resolveVariantClass(
    {
      sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5",
      lg: "px-6 py-3 text-base rounded-lg gap-2.5",
      md: "px-4 py-2 text-sm rounded-md gap-2",
    },
    props.size,
    "md"
  );
});
const variantClass = computed(() => {
  return resolveVariantClass(
    {
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300 dark:bg-slate-800 dark:text-slate-100",
      outline:
        "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30",
      ghost:
        "bg-transparent text-blue-600 border-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30",
      danger: "bg-red-600 text-white hover:bg-red-700 border-transparent",
      primary: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
    },
    props.variant,
    "primary"
  );
});
</script>