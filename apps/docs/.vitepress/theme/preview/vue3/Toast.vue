<template>
  <div
    :role="role"
    :class="
      cn(
        'flex w-full max-w-md items-center gap-1.5 rounded-rounded-full border border-border-subtle bg-components-toast-default-color-container-background-default px-3 py-2 shadow-lg transition-colors hover:bg-components-toast-default-color-container-background-hover',
        className
      )
    "
  >
    <span
      aria-hidden="true"
      :class="
        cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full',
          iconContainerClasses
        )
      "
    >
      <template v-if="type === 'success'">
        <svg
          class="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </template>

      <template v-if="type === 'error'">
        <svg
          class="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 8v5" stroke-linecap="round"></path>
          <circle cx="12" cy="16.5" r="0.75"></circle>
        </svg>
      </template>

      <template v-if="type === 'warning'">
        <svg
          class="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M12 4l9 16H3z"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path d="M12 10v4" stroke-linecap="round"></path>
        </svg>
      </template>

      <template v-if="type === 'info'">
        <svg
          class="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 11v5" stroke-linecap="round"></path>
          <circle cx="12" cy="8" r="0.75"></circle>
        </svg>
      </template>

      <template v-if="type === 'default'">
        <svg
          class="h-3.5 w-3.5 text-components-toast-default-color-icon-foreground-default"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M10 21h4" stroke-linecap="round"></path>
          <path
            d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </template> </span
    ><span class="flex min-w-0 flex-1 flex-col"
      ><span :class="cn('truncate text-sm font-medium', titleClasses)">{{
        title
      }}</span>
      <template v-if="showDescription">
        <span
          class="truncate text-xs text-components-toast-default-color-description-text-default"
          >{{ description }}</span
        >
      </template>
    </span>
    <template v-if="showTimestamp && timestamp !== ''">
      <span
        class="shrink-0 text-xs text-components-toast-default-color-timestamp-text-default"
        >{{ timestamp }}</span
      >
    </template>

    <template v-if="showAction">
      <button
        type="button"
        class="shrink-0 rounded-rounded-sm px-2 py-1 text-xs font-medium text-components-toast-default-color-action-text-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        @click="async (event) => handleAction()"
      >
        {{ actionText }}
      </button>
    </template>

    <template v-if="showClose">
      <button
        type="button"
        aria-label="Dismiss notification"
        class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rounded-full text-components-toast-default-color-close-text-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        @click="async (event) => handleClose()"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface ToastProps {
  type?: "default" | "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  showDescription?: boolean;
  actionText?: string;
  showAction?: boolean;
  showClose?: boolean;
  timestamp?: string;
  showTimestamp?: boolean;
  className?: string;
  onAction?: () => void;
  onClose?: () => void;
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: "default",
  onAction: undefined,
  onClose: undefined,
  className: "",
  title: "Toast Text",
  showDescription: false,
  description: "Toast description text here",
  showTimestamp: true,
  timestamp: "",
  showAction: false,
  actionText: "Undo",
  showClose: false,
});

const role = computed(() => {
  return props.type === "error" ? "alert" : "status";
});
const iconContainerClasses = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-components-toast-success-color-icon-container-background-default";
    case "error":
      return "bg-components-toast-error-color-icon-container-background-default";
    case "warning":
      return "bg-components-toast-warning-color-icon-container-background-default";
    case "info":
      return "bg-components-toast-info-color-icon-container-background-default";
    case "default":
    default:
      return "bg-components-toast-default-color-icon-container-background-default";
  }
});
const titleClasses = computed(() => {
  switch (props.type) {
    case "success":
      return "text-components-toast-success-color-title-text-default";
    case "error":
      return "text-components-toast-error-color-title-text-default";
    case "warning":
      return "text-components-toast-warning-color-title-text-default";
    case "info":
      return "text-components-toast-info-color-title-text-default";
    case "default":
    default:
      return "text-components-toast-default-color-title-text-default";
  }
});

function handleAction() {
  if (props.onAction) {
    props.onAction();
  }
}
function handleClose() {
  if (props.onClose) {
    props.onClose();
  }
}
</script>