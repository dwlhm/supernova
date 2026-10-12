<template>
  <div :class="cn('flex w-full flex-col gap-3', className)">
    <template v-if="showLabel && label !== ''">
      <label
        class="flex items-center gap-1 text-sm font-medium text-components-input-text-area-color-label-foreground-default"
        :for="id"
        >{{ label }}
        <template v-if="required">
          <span
            aria-hidden="true"
            class="text-components-input-text-area-color-required-indicator-foreground-default"
          >
            *
          </span>
        </template>
      </label>
    </template>

    <div
      :class="
        cn(
          'flex items-start gap-2.5 rounded-rounded-lg border bg-components-input-text-area-color-container-background-default px-3 py-1 transition-colors',
          containerClasses,
          disabled && 'opacity-50'
        )
      "
    >
      <template v-if="showLeftIcon">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          :class="cn('mt-2 h-4 w-4 shrink-0', iconClasses)"
        >
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </template>

      <textarea
        class="w-full resize-y bg-transparent py-2 text-sm text-foreground-default outline-none placeholder:text-components-input-text-area-color-placeholder-foreground-default disabled:cursor-not-allowed"
        :id="id"
        :name="name"
        :rows="rows"
        :value="value"
        :placeholder="placeholder"
        :maxLength="maxLength"
        :disabled="disabled"
        :required="required"
        :aria-invalid="hasError"
        :aria-describedby="showHint ? id + '-hint' : undefined"
        @input="async (event) => handleInput(event.target.value)"
      ></textarea>
      <template v-if="showRightIcon">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          :class="cn('mt-2 h-4 w-4 shrink-0', iconClasses)"
        >
          <circle cx="12" cy="12" r="9"></circle>
          <path
            d="m8.5 12 2.5 2.5 4.5-5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </template>
    </div>
    <template v-if="showHint || showCharacterCount">
      <div class="flex items-start justify-between gap-2.5">
        <template v-if="showHint">
          <span :id="id + '-hint'" :class="cn('text-xs', supportingClasses)">{{
            supportingText
          }}</span>
        </template>

        <template v-if="showCharacterCount">
          <span :class="cn('ml-auto shrink-0 text-xs', countClasses)">{{
            countText
          }}</span>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface InputTextAreaProps {
  value?: string;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  showLabel?: boolean;
  showHint?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

const props = withDefaults(defineProps<InputTextAreaProps>(), {
  errorMessage: "",
  hint: "Your message will be copied to the support team.",
  value: "",
  maxLength: 200,
  disabled: false,
  onValueChange: undefined,
  className: "",
  showLabel: true,
  label: "Your message",
  id: "input-textarea",
  required: false,
  showLeftIcon: false,
  name: "input-textarea",
  rows: 4,
  placeholder: "Type your message here.",
  showHint: true,
  showRightIcon: false,
  showCharacterCount: true,
});

const hasError = computed(() => {
  return props.errorMessage !== "";
});
const containerClasses = computed(() => {
  if (hasError) {
    return "border-components-input-text-area-color-container-border-error focus-within:ring-2 focus-within:ring-focus-ring-error";
  }
  return "border-components-input-text-area-color-container-border-default focus-within:border-components-input-text-area-color-container-border-focus focus-within:ring-2 focus-within:ring-focus-ring-primary";
});
const iconClasses = computed(() => {
  if (hasError) {
    return "text-components-input-text-area-all-color-icon-foreground-error";
  }
  return "text-components-input-text-area-all-color-icon-foreground-default";
});
const supportingText = computed(() => {
  return hasError ? props.errorMessage : props.hint;
});
const supportingClasses = computed(() => {
  return hasError
    ? "text-components-input-text-area-color-supporting-text-foreground-error"
    : "text-components-input-text-area-color-supporting-text-foreground-default";
});
const countClasses = computed(() => {
  return hasError
    ? "text-components-input-text-area-color-character-count-foreground-error"
    : "text-components-input-text-area-color-character-count-foreground-default";
});
const countText = computed(() => {
  return props.value.length + " / " + props.maxLength;
});

function handleInput(rawValue: string) {
  if (props.disabled) {
    return;
  }
  if (props.onValueChange) {
    props.onValueChange(rawValue);
  }
}
</script>