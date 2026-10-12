<template>
  <template v-if="open">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-overlay-backdrop"
        aria-hidden="true"
        @click="async (event) => handleCancel()"
      ></div>
      <div
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="headingId"
        :aria-describedby="descriptionId"
        :class="
          cn(
            'relative z-10 w-full max-w-md rounded-rounded-xl border border-components-alert-dialog-default-color-dialog-border-default bg-components-alert-dialog-default-color-dialog-background-default p-6 shadow-xl',
            className
          )
        "
      >
        <h2
          class="text-lg font-semibold text-components-alert-dialog-default-color-heading-text-default"
          :id="headingId"
        >
          {{ heading }}
        </h2>
        <template v-if="showDescription">
          <p
            class="mt-2 text-sm text-components-alert-dialog-default-color-description-text-default"
            :id="descriptionId"
          >
            {{ description }}
          </p>
        </template>

        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center rounded-rounded-lg bg-components-button-secondary-color-container-background-default px-4 text-sm font-medium text-components-button-secondary-color-label-foreground-default transition-colors hover:bg-components-button-secondary-color-container-background-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            @click="async (event) => handleCancel()"
          >
            {{ cancelLabel }}</button
          ><button
            type="button"
            :class="
              cn(
                'inline-flex h-9 items-center justify-center rounded-rounded-lg px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                confirmClasses
              )
            "
            @click="async (event) => handleConfirm()"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface AlertDialogProps {
  open?: boolean;
  heading?: string;
  description?: string;
  showDescription?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  className?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const props = withDefaults(defineProps<AlertDialogProps>(), {
  destructive: false,
  onCancel: undefined,
  onConfirm: undefined,
  open: false,
  className: "",
  heading: "Are you absolutely sure?",
  showDescription: true,
  description:
    "This action cannot be undone. Please confirm that you want to continue.",
  cancelLabel: "Cancel",
  confirmLabel: "Continue",
});

const headingId = computed(() => {
  return "alert-dialog-heading";
});
const descriptionId = computed(() => {
  return "alert-dialog-description";
});
const confirmClasses = computed(() => {
  return props.destructive
    ? "bg-destructive-default text-destructive-on-destructive hover:bg-destructive-hover active:bg-destructive-pressed"
    : "bg-primary-default text-primary-on-primary hover:bg-primary-hover active:bg-primary-pressed";
});

function handleCancel() {
  if (props.onCancel) {
    props.onCancel();
  }
}
function handleConfirm() {
  if (props.onConfirm) {
    props.onConfirm();
  }
}
</script>