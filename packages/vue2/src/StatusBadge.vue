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

<script>
import {
  resolveVariantClass,
  dispatchEvent,
} from "./runtime/component-runtime";

export default {
  name: "status-badge",

  props: {
    variant: { default: "success" },
    onClick: { default: undefined },
    testId: { default: undefined },
    icon: { default: "" },
    text: { default: "" },
  },

  data() {
    return { dispatchEvent };
  },

  computed: {
    variantClass() {
      return resolveVariantClass(
        {
          warning: "bg-amber-100 text-amber-800 border-amber-300",
          danger: "bg-red-100 text-red-800 border-red-300",
          info: "bg-blue-100 text-blue-800 border-blue-300",
          success: "bg-green-100 text-green-800 border-green-300",
        },
        this.variant,
        "success"
      );
    },
  },
};
</script>