<template>
  <div :class="cn('flex w-full flex-col gap-3', className)">
    <template v-if="showLabel && label !== ''">
      <span
        class="flex items-center gap-1 text-sm font-medium text-components-input-file-drop-zone-color-label-foreground-default"
        >{{ label }}
        <template v-if="required">
          <span
            aria-hidden="true"
            class="text-components-input-file-drop-zone-color-required-indicator-foreground-default"
          >
            *
          </span>
        </template>
      </span>
    </template>

    <label
      :class="
        cn(
          'flex flex-col items-center justify-center gap-4 rounded-rounded-lg border bg-components-input-file-drop-zone-color-container-background-default px-6 py-6 text-center transition-colors',
          containerClasses,
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )
      "
      @dragenter="async (event) => setDragging(true)"
      @dragover="async (event) => event.preventDefault()"
      @dragleave="async (event) => setDragging(false)"
      @drop="
        async (event) => {
          event.preventDefault();
          setDragging(false);
          setName(
            event.dataTransfer &&
              event.dataTransfer.files &&
              event.dataTransfer.files.length > 0
              ? event.dataTransfer.files[0].name
              : ''
          );
        }
      "
      ><svg
        aria-hidden="true"
        class="h-6 w-6 shrink-0 text-components-input-file-drop-zone-color-vector-stroke-default"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          d="M12 16V4m0 0L8 8m4-4 4 4"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          stroke-linecap="round"
        ></path>
      </svg>
      <template v-if="!hasFile">
        <span class="flex flex-col items-center gap-1"
          ><span
            class="text-sm text-components-input-file-drop-zone-color-primary-text-foreground-default"
            >{{ primaryText
            }}<span class="font-medium underline underline-offset-2">{{
              browseText
            }}</span></span
          ><span
            class="text-xs text-components-input-file-drop-zone-color-supporting-text-foreground-default"
            >{{ supportingText }}</span
          ></span
        >
      </template>

      <template v-if="hasFile">
        <span class="flex flex-col items-center gap-1"
          ><span
            class="text-sm font-medium text-components-input-file-drop-zone-color-file-name-foreground-filled"
            >{{ fileName }}</span
          >
          <template v-if="fileMetadata !== ''">
            <span
              class="text-xs text-components-input-file-drop-zone-color-file-metadata-foreground-filled"
              >{{ fileMetadata }}</span
            >
          </template>
        </span>
      </template>

      <input
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
    /></label>
    <template v-if="showHint">
      <span :class="cn('text-xs', supportingClasses)">{{
        supportingText
      }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { cn } from "./utils";

export interface InputFileDropZoneProps {
  id?: string;
  label?: string;
  primaryText?: string;
  supportingText?: string;
  browseText?: string;
  fileName?: string;
  fileMetadata?: string;
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

const props = withDefaults(defineProps<InputFileDropZoneProps>(), {
  errorMessage: "",
  fileName: "",
  hint: "You can upload one file.",
  onFileNameChange: undefined,
  className: "",
  showLabel: true,
  label: "Documents",
  required: false,
  disabled: false,
  primaryText: "Drag and drop files here, or",
  browseText: "browse",
  supportingText: "PNG, JPG, or PDF up to 10 MB",
  fileMetadata: "",
  id: "file-drop-zone",
  accept: "image/png,image/jpeg,application/pdf",
  showHint: true,
});
const isDragging = ref(false);

const hasError = computed(() => {
  return props.errorMessage !== "";
});
const hasFile = computed(() => {
  return props.fileName !== "";
});
const containerClasses = computed(() => {
  if (hasError) {
    return "border-components-input-file-drop-zone-color-container-border-error";
  }
  if (isDragging.value) {
    return "border-components-input-file-drop-zone-color-container-border-focus bg-background-subtle";
  }
  return "border-components-input-file-drop-zone-color-container-border-default border-dashed";
});
const supportingText = computed(() => {
  return hasError ? props.errorMessage : props.hint;
});
const supportingClasses = computed(() => {
  return hasError
    ? "text-components-input-file-drop-zone-color-supporting-text-foreground-error"
    : "text-components-input-file-drop-zone-color-supporting-text-foreground-default";
});

function setDragging(value: boolean) {
  isDragging.value = value;
}
function setName(fileName: string) {
  if (props.onFileNameChange) {
    props.onFileNameChange(fileName);
  }
}
</script>