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

<script>
import {
  resolveVariantClass,
  dispatchEvent,
} from "./runtime/component-runtime";

export default {
  name: "button",

  props: {
    size: { default: "md" },
    variant: { default: "primary" },
    onClick: { default: undefined },
    disabled: { default: false },
    type: { default: "button" },
    fullWidth: { default: false },
  },

  data() {
    return { dispatchEvent };
  },

  computed: {
    sizeClass() {
      return resolveVariantClass(
        {
          sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5",
          lg: "px-6 py-3 text-base rounded-lg gap-2.5",
          md: "px-4 py-2 text-sm rounded-md gap-2",
        },
        this.size,
        "md"
      );
    },
    variantClass() {
      return resolveVariantClass(
        {
          secondary:
            "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300 dark:bg-slate-800 dark:text-slate-100",
          outline:
            "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30",
          ghost:
            "bg-transparent text-blue-600 border-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30",
          danger: "bg-red-600 text-white hover:bg-red-700 border-transparent",
          primary:
            "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
        },
        this.variant,
        "primary"
      );
    },
  },
};
</script>