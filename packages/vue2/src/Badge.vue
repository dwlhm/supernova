<template>
  <span
    :class="
      'inline-flex items-center justify-center font-semibold leading-none border' +
      ' ' +
      (rounded ? 'rounded-full' : 'rounded') +
      ' ' +
      sizeClass +
      ' ' +
      variantClass
    "
    ><slot
  /></span>
</template>

<script>
import { resolveVariantClass } from "./runtime/component-runtime";

export default {
  name: "badge",

  props: {
    size: { default: "md" },
    variant: { default: "primary" },
    rounded: { default: false },
  },

  computed: {
    sizeClass() {
      return resolveVariantClass(
        {
          sm: "px-1.5 py-0.5 text-[11px]",
          md: "px-2 py-0.5 text-xs",
        },
        this.size,
        "md"
      );
    },
    variantClass() {
      return resolveVariantClass(
        {
          secondary: "bg-slate-100 text-slate-700 border-transparent",
          success: "bg-green-100 text-green-700 border-transparent",
          warning: "bg-amber-100 text-amber-800 border-transparent",
          danger: "bg-red-100 text-red-700 border-transparent",
          outline: "bg-transparent text-slate-700 border-slate-300",
          primary: "bg-blue-100 text-blue-700 border-transparent",
        },
        this.variant,
        "primary"
      );
    },
  },
};
</script>