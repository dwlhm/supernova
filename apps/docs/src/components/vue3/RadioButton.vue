<template>
  <label
    :class="
      cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )
    "
  >
    <template v-if="leftLabel && hasLabel">
      <span
        class="text-sm text-components-radio-button-all-color-label-foreground-default"
        >{{ label }}</span
      >
    </template>

    <span class="relative inline-flex shrink-0 items-center justify-center"
      ><input
        type="radio"
        class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-rounded-full opacity-0 disabled:cursor-not-allowed"
        :name="name"
        :value="value"
        :checked="checked"
        :disabled="disabled"
        :aria-label="hasLabel ? label : 'Option'"
        @change="async (event) => handleChange()" /><span
        aria-hidden="true"
        :class="
          cn(
            'inline-flex items-center justify-center rounded-rounded-full border bg-components-radio-button-all-color-circle-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary',
            circleClasses,
            checked
              ? 'border-components-radio-button-on-color-indicator-fill-default'
              : 'border-components-radio-button-all-color-circle-border-default'
          )
        "
      >
        <template v-if="checked">
          <span
            :class="
              cn(
                'rounded-rounded-full bg-components-radio-button-on-color-indicator-fill-default',
                dotClasses
              )
            "
          ></span>
        </template> </span
    ></span>
    <template v-if="rightLabel && hasLabel">
      <span
        class="text-sm text-components-radio-button-all-color-label-foreground-default"
        >{{ label }}</span
      >
    </template>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface RadioButtonProps {
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

const props = withDefaults(defineProps<RadioButtonProps>(), {
  size: "medium",
  label: "Label",
  disabled: false,
  onChange: undefined,
  value: "",
  className: "",
  leftLabel: false,
  name: "radio-group",
  checked: false,
  rightLabel: true,
});

const circleClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-4 w-4";
    case "large":
      return "h-6 w-6";
    case "medium":
    default:
      return "h-5 w-5";
  }
});
const dotClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-1.5 w-1.5";
    case "large":
      return "h-2.5 w-2.5";
    case "medium":
    default:
      return "h-2 w-2";
  }
});
const hasLabel = computed(() => {
  return props.label !== "";
});

function handleChange() {
  if (props.disabled) {
    return;
  }
  if (props.onChange) {
    props.onChange(props.value);
  }
}
</script>