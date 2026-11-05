<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="cn('flex w-full flex-col gap-3', className)"
  >
    <template v-if="showLabel && label !== ''">
      <label
        class="flex items-center gap-1 text-sm font-medium text-foreground-default"
        :for="id"
        >{{ label }}
        <template v-if="required">
          <span aria-hidden="true" class="text-destructive-default">*</span>
        </template>
      </label>
    </template>

    <div
      :class="
        cn(
          'flex items-start gap-3 rounded-lg border px-3 py-1 shadow-xs transition-colors',
          disabled
            ? 'border-border-default bg-background-muted cursor-not-allowed opacity-50'
            : getInputState(props).hasError
            ? 'border-destructive-border bg-background-default focus-within:ring-2 focus-within:ring-focus-ring-error'
            : 'border-border-default bg-background-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary'
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
          :class="
            cn(
              'mt-2 h-4 w-4 shrink-0',
              getInputState(props).hasError
                ? 'text-destructive-foreground'
                : 'text-foreground-muted'
            )
          "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            :d="ICON_PATHS.file"
          ></path>
        </svg>
      </template>

      <textarea
        class="w-full resize-y bg-transparent py-2 text-base text-foreground-default outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed"
        :id="id"
        :name="name"
        :rows="rows"
        :value="value"
        :placeholder="placeholder"
        :maxLength="maxLength"
        :disabled="disabled"
        :required="required"
        :aria-invalid="getInputState(props).hasError"
        :aria-describedby="showHint ? id + '-hint' : undefined"
        @input="
          async (event) =>
            !disabled && onValueChange && onValueChange(event.target.value)
        "
      ></textarea>
      <template v-if="showRightIcon">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          :class="
            cn(
              'mt-2 h-4 w-4 shrink-0',
              getInputState(props).hasError
                ? 'text-destructive-foreground'
                : 'text-foreground-muted'
            )
          "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            :d="ICON_PATHS.checkCircle"
          ></path>
        </svg>
      </template>
    </div>
    <template v-if="showHint || showCharacterCount">
      <div class="flex items-start justify-between gap-2.5">
        <template v-if="showHint">
          <span
            :id="id + '-hint'"
            :class="
              cn(
                'text-sm',
                getInputState(props).hasError
                  ? 'text-destructive-foreground'
                  : 'text-foreground-muted'
              )
            "
            >{{ getInputState(props).helpText }}</span
          >
        </template>

        <template v-if="showCharacterCount">
          <span
            :class="
              cn(
                'ml-auto shrink-0 text-sm',
                getInputState(props).hasError
                  ? 'text-destructive-foreground'
                  : 'text-foreground-muted'
              )
            "
            >{{ getInputState(props).countText }}</span
          >
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { cn, getInputState, ICON_PATHS, bindControllerProps } from "./utils";

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
  className: "",
  showLabel: true,
  label: "Your message",
  id: "input-textarea",
  required: false,
  disabled: false,
  showLeftIcon: false,
  name: "input-textarea",
  rows: 4,
  value: "",
  placeholder: "Type your message here.",
  maxLength: 200,
  showHint: true,
  onValueChange: undefined,
  showRightIcon: false,
  showCharacterCount: true,
  hint: 'Your message will be copied to the support team.',
  errorMessage: '',
});
</script>