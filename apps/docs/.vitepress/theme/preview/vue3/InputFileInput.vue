<template>
  <div :class="cn('flex w-full flex-col gap-3', className)">
    <template v-if="showLabel && label !== ''">
      <span
        class="flex items-center gap-1 text-sm font-medium text-components-input-file-input-color-label-foreground-default"
        >{{ label }}
        <template v-if="required">
          <span
            aria-hidden="true"
            class="text-components-input-file-input-color-required-indicator-foreground-default"
          >
            *
          </span>
        </template>
      </span>
    </template>

    <label
      :class="
        cn(
          'flex items-center gap-2.5 rounded-rounded-lg border bg-components-input-file-input-color-container-background-default px-3 py-1 transition-colors',
          containerClasses,
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )
      "
      ><span
        class="inline-flex h-7 shrink-0 items-center rounded-rounded-sm bg-components-button-secondary-color-container-background-default px-3 text-xs font-medium text-components-input-file-input-color-button-label-foreground-default"
        >{{ buttonText }}</span
      ><span
        :class="
          cn(
            'truncate py-1 text-sm',
            hasFile
              ? 'text-components-input-file-input-color-file-name-foreground-filled'
              : 'text-components-input-file-input-color-file-name-foreground-default'
          )
        "
        >{{ displayName }}</span
      ><input
        type="file"
        class="sr-only"
        :id="id"
        :accept="accept"
        :disabled="disabled"
        :required="required"
        :aria-invalid="hasError"
        @change="
          async (event) =>
            setName(
              event.target.files && event.target.files.length > 0
                ? event.target.files[0].name
                : ''
            )
        "
      />
      <template v-if="hasFile">
        <button
          type="button"
          aria-label="Remove file"
          class="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full text-components-input-file-input-color-file-name-foreground-filled hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          @click="async (event) => clear()"
        >
          <svg
            aria-hidden="true"
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"></path>
          </svg>
        </button>
      </template>
    </label>
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

export interface InputFileInputProps {
  id?: string;
  label?: string;
  buttonText?: string;
  fileName?: string;
  hint?: string;
  errorMessage?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onFileNameChange?: (fileName: string) => void;
}

const props = withDefaults(defineProps<InputFileInputProps>(), {
  errorMessage: "",
  fileName: "",
  hint: "Supported formats: PNG, JPG, or PDF.",
  onFileNameChange: undefined,
  className: "",
  showLabel: true,
  label: "Picture",
  required: false,
  disabled: false,
  buttonText: "Choose File",
  id: "input-file",
  accept: "image/png,image/jpeg,application/pdf",
  showHint: true,
});

const hasError = computed(() => {
  return props.errorMessage !== "";
});
const hasFile = computed(() => {
  return props.fileName !== "";
});
const containerClasses = computed(() => {
  if (hasError) {
    return "border-components-input-file-input-color-container-border-error";
  }
  return "border-components-input-file-input-color-container-border-default focus-within:border-components-input-file-input-color-container-border-focus";
});
const supportingText = computed(() => {
  return hasError ? props.errorMessage : props.hint;
});
const supportingClasses = computed(() => {
  return hasError
    ? "text-components-input-file-input-color-supporting-text-foreground-error"
    : "text-components-input-file-input-color-supporting-text-foreground-default";
});
const displayName = computed(() => {
  return hasFile ? props.fileName : "No file chosen";
});

function setName(fileName: string) {
  if (props.onFileNameChange) {
    props.onFileNameChange(fileName);
  }
}
function clear() {
  setName("");
}
</script>