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

    <label
      :for="id"
      :class="
        cn(
          'flex flex-col items-center justify-center gap-3 rounded-lg border bg-background-default px-6 py-6 text-center shadow-sm transition-colors',
          getFileState(props).hasError
            ? 'border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error'
            : 'border-border-default border-dashed focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )
      "
      @dragover="async (event) => event.preventDefault()"
      @drop="
        async (event) =>
          !disabled &&
          handleFileSelectEvent(event, onFileNameChange, onFilesChange)
      "
      ><svg
        aria-hidden="true"
        class="h-6 w-6 shrink-0 text-foreground-default"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          :d="ICON_PATHS.upload"
        ></path>
      </svg>
      <template v-if="!getFileState(props).hasFile">
        <span class="flex flex-col items-center gap-1"
          ><span
            class="inline-flex flex-wrap items-center justify-center gap-1.5 text-base text-foreground-default"
            ><span
              class="inline-flex items-center rounded-lg bg-secondary-default px-2 py-0.5 text-sm font-medium text-secondary-foreground"
              >{{ browseText }}</span
            ><span>{{ primaryText }}</span></span
          ><span class="text-sm text-foreground-muted">{{
            supportingText
          }}</span></span
        >
      </template>

      <template v-if="getFileState(props).hasFile">
        <span class="flex flex-col items-center gap-1"
          ><span class="text-sm font-medium text-foreground-default">{{
            fileName
          }}</span>
          <template v-if="fileMetadata !== ''">
            <span class="text-xs text-foreground-muted">{{
              fileMetadata
            }}</span>
          </template>
        </span>
      </template>

      <input
        type="file"
        class="sr-only"
        :id="id"
        :name="name"
        :accept="accept"
        :disabled="disabled"
        :required="required"
        :aria-invalid="getFileState(props).hasError"
        :aria-describedby="showHint ? id + '-hint' : undefined"
        @change="
          async (event) =>
            !disabled &&
            handleFileSelectEvent(event, onFileNameChange, onFilesChange)
        "
    /></label>
    <template v-if="showHint">
      <span
        :id="id + '-hint'"
        :class="
          cn(
            'text-sm',
            getFileState(props).hasError
              ? 'text-destructive-default'
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
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

export interface InputFileDropZoneProps {
  id?: string;
  name?: string;
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
  onFilesChange?: (files: unknown[]) => void;
}

const props = withDefaults(defineProps<InputFileDropZoneProps>(), {
  className: "",
  showLabel: true,
  label: "Documents",
  id: "file-drop-zone",
  required: false,
  disabled: false,
  onFileNameChange: undefined,
  onFilesChange: undefined,
  browseText: "Browse",
  primaryText: "or drag and drop files here",
  supportingText: "PNG, JPG, or PDF up to 10 MB",
  fileName: "",
  fileMetadata: "",
  name: "drop-file",
  accept: "image/png,image/jpeg,application/pdf",
  showHint: true,
  hint: 'You can upload one file.',
  errorMessage: '',
});
</script>