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

<script>
import { resolveVariantClass } from "./runtime/component-runtime";

export default {
  name: "typography",

  props: {
    variant: { default: "body" },
    align: { default: "left" },
    weight: { default: undefined },
    color: { default: undefined },
  },

  computed: {
    variantClass() {
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
        this.variant,
        "body"
      );
    },
    alignClass() {
      return resolveVariantClass(
        {
          center: "text-center",
          right: "text-right",
          left: "text-left",
        },
        this.align,
        "left"
      );
    },
    weightClass() {
      return resolveVariantClass(
        {
          bold: "font-bold",
          semibold: "font-semibold",
          medium: "font-medium",
          normal: "font-normal",
        },
        this.weight,
        undefined
      );
    },
  },
};
</script>