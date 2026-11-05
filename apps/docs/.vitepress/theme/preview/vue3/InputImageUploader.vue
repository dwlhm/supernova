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
          'flex items-center gap-4 rounded-lg border bg-background-default p-3 shadow-xs transition-colors',
          getFileState(props).hasError
            ? 'border-destructive-border focus-within:ring-2 focus-within:ring-focus-ring-error'
            : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary',
          disabled && 'cursor-not-allowed opacity-50'
        )
      "
    >
      <span
        aria-hidden="true"
        class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-muted"
      >
        <template v-if="imageSrc !== ''">
          <img alt="" class="h-full w-full object-cover" :src="imageSrc" />
        </template>

        <template v-if="imageSrc === ''">
          <svg
            class="h-8 w-8 text-foreground-subtle"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              :d="ICON_PATHS.image"
            ></path>
          </svg>
        </template> </span
      ><span class="flex min-w-0 flex-1 flex-col gap-2"
        ><span class="truncate text-sm font-medium text-foreground-default">
          <template v-if="getFileState(props).hasFile">
            {{ fileName }}
          </template>

          <template v-else>
            {{ primaryText }}
          </template> </span
        ><span class="truncate text-sm text-foreground-muted">
          <template v-if="getFileState(props).hasFile && fileMetadata !== ''">
            {{ fileMetadata }}
          </template>

          <template v-else>
            {{ supportingText }}
          </template> </span
        ><span class="flex items-center gap-2"
          ><label
            :for="id"
            :class="
              cn(
                'inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-focus-ring-primary',
                disabled
                  ? 'pointer-events-none cursor-not-allowed'
                  : 'cursor-pointer'
              )
            "
          >
            <template v-if="getFileState(props).hasFile"> Replace </template>

            <template v-else> Choose image </template>
            <input
              type="file"
              class="sr-only"
              :id="id"
              :name="name"
              :accept="accept"
              :disabled="disabled"
              :required="required"
              :aria-invalid="getFileState(props).hasError"
              @change="
                async (event) =>
                  !disabled &&
                  handleFileSelectEvent(
                    event,
                    onFileNameChange,
                    onFilesChange,
                    onPreviewChange
                  )
              "
          /></label>
          <template v-if="getFileState(props).hasFile">
            <button
              type="button"
              class="inline-flex items-center rounded-lg px-2 py-0.5 text-sm font-medium text-foreground-default hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              :disabled="disabled"
              @click="
                async (event) =>
                  !disabled &&
                  clearFileInputEvent(event, onFileNameChange, onFilesChange)
              "
            >
              Remove
            </button>
          </template>
        </span></span
      >
    </div>
    <template v-if="showHint">
      <span
        :id="id + '-hint'"
        :class="
          cn(
            'text-sm',
            getFileState(props).hasError
              ? 'text-destructive-foreground'
              : 'text-foreground-muted'
          )
        "
        >{{ getFileState(props).helpText }}</span
      >
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  cn,
  getFileState,
  handleFileSelectEvent,
  clearFileInputEvent,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

export interface InputImageUploaderProps {
  id?: string;
  name?: string;
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
  onFilesChange?: (files: unknown[]) => void;
  onPreviewChange?: (url: string) => void;
}

const props = withDefaults(defineProps<InputImageUploaderProps>(), {
  className: "",
  showLabel: true,
  label: "Profile image",
  id: "image-uploader",
  required: true,
  disabled: false,
  imageSrc: "",
  primaryText: "Upload an image",
  fileName: "",
  fileMetadata: "",
  supportingText: "Square JPG or PNG, up to 5 MB",
  name: "image-file",
  accept: "image/png,image/jpeg",
  onFileNameChange: undefined,
  onFilesChange: undefined,
  onPreviewChange: undefined,
  showHint: true,
  hint: 'For best results, use a 1:1 image.',
  errorMessage: '',
});
</script>