<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="cn('flex w-full flex-col gap-3', className)"
  >
    <template v-if="showLabel && label !== ''">
      <span class="flex items-center justify-between gap-3"
        ><label
          class="flex items-center gap-1 text-sm font-medium text-foreground-default"
          :for="id"
          >{{ label }}
          <template v-if="required">
            <span aria-hidden="true" class="text-destructive-default">*</span>
          </template> </label
        ><span class="text-sm text-foreground-muted">{{
          fileCount
        }}</span></span
      >
    </template>

    <label
      :for="id"
      :class="
        cn(
          'flex h-[52px] w-full items-center gap-3 rounded-lg border bg-background-default px-3 shadow-sm transition-colors',
          getFileState(props).hasError
            ? 'border-destructive-default focus-within:ring-2 focus-within:ring-focus-ring-error'
            : 'border-border-default focus-within:border-primary-border-emphasis focus-within:ring-2 focus-within:ring-focus-ring-primary',
          disabled
            ? 'pointer-events-none cursor-not-allowed opacity-50'
            : 'cursor-pointer'
        )
      "
      ><span class="flex-1 truncate text-base text-foreground-muted">{{
        instruction
      }}</span
      ><span
        class="inline-flex shrink-0 items-center justify-center rounded-lg bg-secondary-default px-3 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover"
        >{{ browseText }}</span
      ><input
        type="file"
        class="sr-only"
        :id="id"
        :name="name"
        :multiple="true"
        :accept="accept"
        :disabled="disabled"
        :required="required"
        :aria-invalid="getFileState(props).hasError"
        @change="
          async (event) =>
            !disabled && handleFileSelectEvent(event, undefined, onFilesChange)
        "
    /></label>
    <template v-if="getFileState(props).files.length > 0">
      <ul class="flex flex-col gap-2">
        <template
          :key="file.id"
          v-for="(file, index) in getFileState(props).files"
        >
          <li
            class="flex items-center justify-between gap-2 rounded-md border border-border-default bg-background-subtle p-3"
          >
            <span class="flex min-w-0 items-center gap-2"
              ><svg
                aria-hidden="true"
                class="h-4 w-4 shrink-0 text-foreground-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="ICON_PATHS.file"
                ></path></svg
              ><span class="flex min-w-0 flex-col"
                ><span
                  class="truncate text-sm font-medium text-foreground-default"
                  >{{ file.name }}</span
                ><span class="truncate text-xs text-foreground-muted">{{
                  file.status
                }}</span></span
              ></span
            ><button
              type="button"
              class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-muted hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              :disabled="disabled"
              :aria-label="'Remove ' + file.name"
              @click="
                async (event) => !disabled && onRemove && onRemove(file.id)
              "
            >
              <svg
                aria-hidden="true"
                class="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" :d="ICON_PATHS.close"></path>
              </svg>
            </button>
          </li>
        </template>
      </ul>
    </template>

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

export interface UploadedFile {
  id: string;
  name: string;
  status: string;
}
export interface InputMultipleFileUploadProps {
  id?: string;
  name?: string;
  label?: string;
  instruction?: string;
  browseText?: string;
  files?: UploadedFile[];
  fileCount?: string;
  hint?: string;
  errorMessage?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHint?: boolean;
  className?: string;
  onRemove?: (id: string) => void;
  onFilesChange?: (files: unknown[]) => void;
}

const props = withDefaults(defineProps<InputMultipleFileUploadProps>(), {
  className: "",
  showLabel: true,
  label: "Attachments",
  id: "multiple-file-upload",
  required: true,
  fileCount: "0 of 5",
  disabled: false,
  instruction: "Choose one or more files",
  browseText: "Browse",
  name: "files",
  accept: "image/png,image/jpeg,application/pdf,application/zip",
  onFilesChange: undefined,
  onRemove: undefined,
  showHint: true,
  files: () => [],
  hint: 'Up to 5 files, 10 MB each.',
  errorMessage: '',
});
</script>