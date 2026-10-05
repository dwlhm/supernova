<template>
  <div
    @click="async (event) => dispatchEvent(onClick, event, false)"
    :data-testid="testId"
    :class="
      'bg-white rounded-lg overflow-hidden transition-shadow duration-150' +
      ' ' +
      (bordered ? 'border border-slate-200' : 'border-0') +
      ' ' +
      shadowClass +
      ' ' +
      paddingClass +
      ' ' +
      (onClick ? 'cursor-pointer hover:shadow-lg' : '')
    "
  >
    <template v-if="title">
      <div :class="subtitle ? 'mb-1' : 'mb-3'">
        <h3 class="m-0 text-lg font-semibold text-slate-900 leading-snug">
          {{ title }}
        </h3>
      </div>
    </template>

    <template v-if="subtitle">
      <div class="mb-3">
        <p class="m-0 text-sm text-slate-500 leading-relaxed">{{ subtitle }}</p>
      </div>
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
  name: "card",

  props: {
    padding: { default: "md" },
    shadow: { default: "md" },
    onClick: { default: undefined },
    testId: { default: undefined },
    bordered: { default: false },
    title: { default: "" },
    subtitle: { default: "" },
  },

  data() {
    return { dispatchEvent };
  },

  computed: {
    paddingClass() {
      return resolveVariantClass(
        {
          none: "p-0",
          sm: "p-3",
          lg: "p-6",
          md: "p-4",
        },
        this.padding,
        "md"
      );
    },
    shadowClass() {
      return resolveVariantClass(
        {
          none: "shadow-none",
          sm: "shadow-sm",
          lg: "shadow-lg",
          md: "shadow-md",
        },
        this.shadow,
        "md"
      );
    },
  },
};
</script>