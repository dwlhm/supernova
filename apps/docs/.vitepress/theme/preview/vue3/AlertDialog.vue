<template>
  <template v-if="open">
    <div
      :data-ctrl="typeof bindControllerProps"
      :class="
        inline
          ? 'relative flex w-full items-center justify-center p-4'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4'
      "
    >
      <template v-if="!inline">
        <div
          class="absolute inset-0 bg-overlay-backdrop"
          aria-hidden="true"
          @click="async (event) => onCancel && onCancel()"
        ></div>
      </template>

      <div
        role="alertdialog"
        aria-modal="true"
        :tabIndex="-1"
        :aria-labelledby="
          createDialogState({
            id: 'alert-dialog',
          }).titleId
        "
        :aria-describedby="
          showDescription
            ? createDialogState({
                id: 'alert-dialog',
              }).descriptionId
            : undefined
        "
        @keydown="
          async (event) => event.key === 'Escape' && onCancel && onCancel()
        "
        :class="
          cn(
            'relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border-default bg-background-default p-6 shadow-lg',
            className
          )
        "
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2.5">
            <h2
              class="flex-1 text-xl leading-6 font-semibold text-foreground-default"
              :id="
                createDialogState({
                  id: 'alert-dialog',
                }).titleId
              "
            >
              {{ heading }}
            </h2>
            <template v-if="showCloseButton">
              <button
                type="button"
                aria-label="Close"
                class="inline-flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
                @click="async (event) => onCancel && onCancel()"
              >
                <svg
                  class="h-3.5 w-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 3L3 11M3 3l8 8"></path>
                </svg>
              </button>
            </template>
          </div>
          <template v-if="showDescription">
            <p
              class="text-sm leading-5 text-foreground-muted"
              :id="
                createDialogState({
                  id: 'alert-dialog',
                }).descriptionId
              "
            >
              {{ description }}
            </p>
          </template>
        </div>
        <template v-if="$slots.default">
          <slot />
        </template>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center rounded-lg bg-secondary-default px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            @click="async (event) => onCancel && onCancel()"
          >
            {{ cancelLabel }}</button
          ><button
            type="button"
            :class="
              cn(
                'inline-flex h-9 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary',
                destructive
                  ? 'bg-destructive-background hover:bg-destructive-hover active:bg-destructive-pressed'
                  : 'bg-primary-default hover:bg-primary-hover active:bg-primary-pressed'
              )
            "
            @click="async (event) => onConfirm && onConfirm()"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { cn, createDialogState, bindControllerProps } from "./utils";

export interface AlertDialogProps {
  open?: boolean;
  inline?: boolean;
  heading?: string;
  description?: string;
  showDescription?: boolean;
  showCloseButton?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  className?: string;

  onCancel?: () => void;
  onConfirm?: () => void;
}

const props = withDefaults(defineProps<AlertDialogProps>(), {
  open: true,
  inline: false,
  onCancel: undefined,
  showDescription: true,
  className: "",
  heading: "",
  showCloseButton: true,
  description: "",

  cancelLabel: "Cancel",
  destructive: false,
  onConfirm: undefined,
  confirmLabel: "Continue",
});
defineSlots<{ default?: () => any }>();
</script>