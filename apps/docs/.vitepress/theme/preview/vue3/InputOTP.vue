<template>
  <div
    :id="id"
    :data-ctrl="typeof bindControllerProps"
    :class="cn('flex w-full flex-col gap-3', className)"
  >
    <template v-if="showLabel && label !== ''">
      <span
        class="flex items-center gap-1 text-sm font-medium text-foreground-default"
        >{{ label }}
        <template v-if="required">
          <span aria-hidden="true" class="text-destructive-default">*</span>
        </template>
      </span>
    </template>

    <div
      class="flex items-center gap-2.5"
      role="group"
      :aria-label="label"
      @paste="
        async (event) =>
          !disabled && handleOtpPasteEvent(event, length || 6, onChange)
      "
    >
      <template
        :key="digit.index"
        v-for="(digit, index) in getOtpState(props).digits"
      >
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxlength="1"
          :value="digit.char"
          :disabled="disabled"
          :aria-label="label + ' digit ' + (digit.index + 1)"
          :aria-invalid="getOtpState(props).hasError"
          :aria-describedby="showHint ? id + '-hint' : undefined"
          :class="
            cn(
              'h-9 w-9 rounded-md border bg-background-default text-center text-base font-medium text-foreground-default shadow-xs outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              getOtpState(props).hasError
                ? 'border-destructive-border focus:ring-2 focus:ring-focus-ring-error'
                : 'border-border-default focus:border-primary-border-emphasis focus:ring-2 focus:ring-focus-ring-primary'
            )
          "
          @keydown="
            async (event) =>
              !disabled &&
              handleOtpKeyDownEvent(
                event,
                digit.index,
                value,
                length || 6,
                onChange
              )
          "
          @input="
            async (event) =>
              !disabled &&
              handleOtpInputEvent(
                event,
                digit.index,
                value,
                length || 6,
                onChange
              )
          "
        />
      </template>
    </div>
    <template v-if="showHint">
      <span
        :id="id + '-hint'"
        :class="
          cn(
            'text-sm',
            getOtpState(props).hasError
              ? 'text-destructive-foreground'
              : 'text-foreground-muted'
          )
        "
        >{{ getOtpState(props).helpText }}</span
      >
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  cn,
  getOtpState,
  handleOtpInputEvent,
  handleOtpKeyDownEvent,
  handleOtpPasteEvent,
  bindControllerProps,
} from "./utils";

export interface InputOTPProps {
  value?: string;
  length?: number;
  id?: string;
  name?: string;
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
  id: "input-otp",
  className: "",
  showLabel: true,
  label: "Label",
  required: false,
  disabled: false,
  length: 6,
  onChange: undefined,
  showHint: true,
  value: "",
  name: 'otp',
  hint: 'Please enter the one-time password sent to your phone.',
  errorMessage: '',
});
</script>