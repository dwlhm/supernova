<template>
  <div
    @click="async (event) => dispatchEvent(onClick, event, false)"
    :data-testid="testId"
    :class="
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium' +
      ' ' +
      variantClass +
      ' ' +
      (onClick ? 'cursor-pointer hover:opacity-90' : '')
    "
  >
    <template v-if="icon">
      <p class="m-0 leading-none">{{ icon }}</p>
    </template>

    <template v-if="text">
      <p class="m-0 leading-none">{{ text }}</p>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import {
  resolveVariantClass,
  dispatchEvent,
} from "./runtime/component-runtime";

// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

export interface StatusBadgeProps {
  children?: any;
  icon?: any;
  text?: string;
  variant?: "success" | "warning" | "danger" | "info";
  testId?: string;
  onClick?: (event: any) => void;
}

const props = withDefaults(defineProps<StatusBadgeProps>(), {
  variant: "success",
  onClick: undefined,
  testId: undefined,
  icon: "",
  text: "",
  children: undefined,
});

const variantClass = computed(() => {
  return resolveVariantClass(
    {
      warning: "bg-amber-100 text-amber-800 border-amber-300",
      danger: "bg-red-100 text-red-800 border-red-300",
      info: "bg-blue-100 text-blue-800 border-blue-300",
      success: "bg-green-100 text-green-800 border-green-300",
    },
    props.variant,
    "success"
  );
});
</script>