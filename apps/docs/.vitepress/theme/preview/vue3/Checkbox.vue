<template>
  <label
    :class="
      cn(
        'inline-flex items-center',
        gapClasses,
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )
    "
  >
    <template v-if="leftLabel && hasLabel">
      <span
        class="text-sm text-components-checkbox-all-color-label-foreground-default"
        >{{ label }}</span
      >
    </template>

    <span class="relative inline-flex shrink-0 items-center justify-center"
      ><input
        type="checkbox"
        class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        :name="name"
        :value="value"
        :checked="checked"
        :disabled="disabled"
        :aria-label="hasLabel ? label : 'Checkbox'"
        @change="async (event) => handleChange()" /><span
        aria-hidden="true"
        :class="
          cn(
            'inline-flex items-center justify-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary',
            boxClasses,
            checked
              ? 'border-components-checkbox-on-color-container-background-default bg-components-checkbox-on-color-container-background-default text-components-checkbox-on-color-icon-foreground-default'
              : 'border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default'
          )
        "
      >
        <template v-if="checked">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            :class="cn('shrink-0', iconClasses)"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </template> </span
    ></span>
    <template v-if="rightLabel && hasLabel">
      <span
        class="text-sm text-components-checkbox-all-color-label-foreground-default"
        >{{ label }}</span
      >
    </template>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  label?: string;
  leftLabel?: boolean;
  rightLabel?: boolean;
  name?: string;
  value?: string;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  size: "medium",
  label: "Label",
  disabled: false,
  onCheckedChange: undefined,
  checked: false,
  className: "",
  leftLabel: false,
  name: "checkbox",
  value: "",
  rightLabel: true,
});

const boxClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-4 w-4 rounded-rounded-sm";
    case "large":
      return "h-6 w-6 rounded-rounded-lg";
    case "medium":
    default:
      return "h-5 w-5 rounded-rounded-md";
  }
});
const iconClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "h-3 w-3";
    case "large":
      return "h-4 w-4";
    case "medium":
    default:
      return "h-3.5 w-3.5";
  }
});
const gapClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "gap-1.5";
    case "large":
      return "gap-2.5";
    case "medium":
    default:
      return "gap-2";
  }
});
const hasLabel = computed(() => {
  return props.label !== "";
});

function handleChange() {
  if (props.disabled) {
    return;
  }
  if (props.onCheckedChange) {
    props.onCheckedChange(!props.checked);
  }
}
</script>