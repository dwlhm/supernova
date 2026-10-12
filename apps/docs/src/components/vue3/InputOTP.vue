<template>
  <div :class="cn('flex w-full flex-col gap-3', className)">
    <template v-if="showLabel && label !== ''">
      <span
        class="flex items-center gap-1 text-sm font-medium text-components-input-otp-color-label-foreground-default"
        >{{ label }}
        <template v-if="required">
          <span
            aria-hidden="true"
            class="text-components-input-otp-color-required-indicator-foreground-default"
          >
            *
          </span>
        </template>
      </span>
    </template>

    <div class="flex items-center gap-2.5" role="group" :aria-label="label">
      <template :key="digit.index" v-for="(digit, index) in digits">
        <input
          type="text"
          maxlength="1"
          :value="digit.char"
          :disabled="disabled"
          :aria-label="label + ' digit ' + (digit.index + 1)"
          :aria-invalid="hasError"
          :class="
            cn(
              'h-12 w-10 rounded-rounded-md border bg-components-input-otp-color-box-background-default text-center text-base font-medium text-components-input-otp-color-otp-value-foreground-filled outline-none transition-colors focus:ring-2 focus:ring-focus-ring-primary disabled:cursor-not-allowed disabled:opacity-50',
              boxClasses
            )
          "
          @input="async (event) => handleDigit(digit.index, event.target.value)"
        />
      </template>
    </div>
    <template v-if="showHint">
      <span :class="cn('text-xs', supportingClasses)">{{
        supportingText
      }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface OtpDigit {
  index: number;
  char: string;
}
export interface InputOTPProps {
  value?: string;
  length?: number;
  id?: string;
  label?: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

const props = withDefaults(defineProps<InputOTPProps>(), {
  errorMessage: "",
  length: 6,
  value: "",
  hint: "Please enter the one-time password sent to your phone.",
  disabled: false,
  onChange: undefined,
  className: "",
  showLabel: true,
  label: "Label",
  required: false,
  showHint: true,
});

const hasError = computed(() => {
  return props.errorMessage !== "";
});
const digits = computed(() => {
  const total = props.length;
  const chars = props.value ? props.value.split("") : [];
  const rows: OtpDigit[] = [];
  for (let i = 0; i < total; i++) {
    rows.push({
      index: i,
      char: i < chars.length ? chars[i] : "",
    });
  }
  return rows;
});
const boxClasses = computed(() => {
  if (hasError) {
    return "border-components-input-otp-color-box-border-error";
  }
  return "border-components-input-otp-color-box-border-default focus:border-components-input-otp-color-box-border-focus";
});
const supportingText = computed(() => {
  return hasError ? props.errorMessage : props.hint;
});
const supportingClasses = computed(() => {
  return hasError
    ? "text-components-input-otp-color-supporting-text-foreground-error"
    : "text-components-input-otp-color-supporting-text-foreground-default";
});

function handleDigit(index: number, rawValue: string) {
  if (props.disabled) {
    return;
  }
  const total = props.length;
  const current = props.value || "";
  const chars: string[] = [];
  for (let i = 0; i < total; i++) {
    chars.push(i < current.length ? current[i] : "");
  }
  const nextChar = rawValue !== "" ? rawValue.slice(rawValue.length - 1) : "";
  chars[index] = nextChar;
  if (props.onChange) {
    props.onChange(chars.join(""));
  }
}
</script>