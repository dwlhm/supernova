<template>
  <div :class="cn('flex w-full flex-col gap-3', className)">
    <template v-if="showLabel && label !== ''">
      <span
        class="flex items-center gap-1 text-sm font-medium text-components-input-image-uploader-color-label-foreground-default"
        >{{ label }}
        <template v-if="required">
          <span
            aria-hidden="true"
            class="text-components-input-image-uploader-color-required-indicator-foreground-default"
          >
            *
          </span>
        </template>
      </span>
    </template>

    <div
      :class="
        cn(
          'flex items-center gap-4 rounded-rounded-lg border bg-components-input-image-uploader-color-container-background-default p-3 transition-colors',
          containerClasses,
          disabled && 'opacity-50'
        )
      "
    >
      <span
        class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-rounded-lg bg-components-input-image-uploader-color-preview-background-default"
        aria-hidden="true"
      >
        <template v-if="imageSrc !== ''">
          <img alt="" class="h-full w-full object-cover" :src="imageSrc" />
        </template>

        <template v-if="imageSrc === ''">
          <svg
            class="h-8 w-8 text-components-input-image-uploader-color-icon-fill-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path
              d="m21 15-5-5L5 21"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
          </svg>
        </template> </span
      ><span class="flex min-w-0 flex-1 flex-col gap-2"
        ><span
          class="truncate text-sm font-medium text-components-input-image-uploader-color-primary-text-foreground-default"
        >
          <template v-if="hasFile">
            {{ fileName }}
          </template>

          <template v-else>
            {{ primaryText }}
          </template> </span
        ><span
          class="truncate text-xs text-components-input-image-uploader-color-supporting-text-foreground-default"
        >
          <template v-if="hasFile && fileMetadata !== ''">
            {{ fileMetadata }}
          </template>

          <template v-else>
            {{ supportingText }}
          </template> </span
        ><span class="flex items-center gap-2"
          ><label
            class="inline-flex cursor-pointer items-center rounded-rounded-sm border border-components-input-image-uploader-color-container-border-default bg-components-input-image-uploader-color-container-background-default px-3 py-1 text-xs font-medium text-components-input-image-uploader-color-primary-text-foreground-default focus-within:ring-2 focus-within:ring-focus-ring-primary"
          >
            <template v-if="hasFile"> Replace </template>

            <template v-else> Browse </template>
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
          <template v-if="hasFile">
            <button
              type="button"
              class="inline-flex items-center rounded-rounded-sm px-2 py-1 text-xs font-medium text-components-input-image-uploader-color-primary-text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              @click="async (event) => clear()"
            >
              Remove
            </button>
          </template>
        </span></span
      >
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

export interface InputImageUploaderProps {
  id?: string;
  label?: string;
  primaryText?: string;
  supportingText?: string;
  fileName?: string;
  fileMetadata?: string;
  imageSrc?: string;
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

const props = withDefaults(defineProps<InputImageUploaderProps>(), {
  errorMessage: "",
  fileName: "",
  hint: "For best results, use a 1:1 image.",
  onFileNameChange: undefined,
  className: "",
  showLabel: true,
  label: "Profile image",
  required: true,
  disabled: false,
  imageSrc: "",
  primaryText: "Upload an image",
  fileMetadata: "",
  supportingText: "Square JPG or PNG, up to 5 MB",
  id: "image-uploader",
  accept: "image/png,image/jpeg",
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
    return "border-components-input-image-uploader-color-container-border-error";
  }
  return "border-components-input-image-uploader-color-container-border-default focus-within:border-components-input-image-uploader-color-container-border-focus";
});
const supportingText = computed(() => {
  return hasError ? props.errorMessage : props.hint;
});
const supportingClasses = computed(() => {
  return hasError
    ? "text-components-input-image-uploader-color-helper-text-foreground-error"
    : "text-components-input-image-uploader-color-helper-text-foreground-default";
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