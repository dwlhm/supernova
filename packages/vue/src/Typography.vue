<template>
  <div
    :class="
      'm-0 text-slate-900' +
      ' ' +
      variantClass +
      ' ' +
      alignClass +
      ' ' +
      weightClass +
      ' ' +
      (color || '')
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { resolveVariantClass } from "./runtime/component-runtime";

// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

export interface TypographyProps {
  children?: any;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "body-sm"
    | "caption";
  color?: string;
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold";
}

const props = withDefaults(defineProps<TypographyProps>(), {
  variant: "body",
  align: "left",
  weight: undefined,
  color: undefined,
  children: undefined,
});

const variantClass = computed(() => {
  return resolveVariantClass(
    {
      h1: "text-4xl font-bold tracking-tight",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
      "body-sm": "text-xs leading-normal",
      caption: "text-[11px] leading-tight text-slate-500",
      body: "text-sm leading-relaxed",
    },
    props.variant,
    "body"
  );
});
const alignClass = computed(() => {
  return resolveVariantClass(
    {
      center: "text-center",
      right: "text-right",
      left: "text-left",
    },
    props.align,
    "left"
  );
});
const weightClass = computed(() => {
  return resolveVariantClass(
    {
      bold: "font-bold",
      semibold: "font-semibold",
      medium: "font-medium",
      normal: "font-normal",
    },
    props.weight,
    undefined
  );
});
</script>