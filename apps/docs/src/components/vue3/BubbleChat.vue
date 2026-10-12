<template>
  <div
    :class="
      cn('flex w-full', isOutgoing ? 'justify-end' : 'justify-start', className)
    "
  >
    <div :class="cn('flex max-w-xs flex-col gap-1', isOutgoing && 'items-end')">
      <div :class="cn('rounded-rounded-2xl px-4 py-3', bubbleClasses)">
        <template v-if="type === 'text'">
          <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ text }}</p>
        </template>

        <template v-if="type === 'file'">
          <div class="flex items-center gap-2">
            <svg
              aria-hidden="true"
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M14 3v5h5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path></svg
            ><span class="flex flex-col"
              ><span class="truncate text-sm font-medium">{{ fileName }}</span
              ><span :class="cn('text-xs', previewMetaClasses)">{{
                fileMeta
              }}</span></span
            >
          </div>
        </template>

        <template v-if="type === 'image' || type === 'video'">
          <div class="flex flex-col gap-2">
            <div
              :class="
                cn(
                  'flex h-32 w-60 items-center justify-center rounded-rounded-xl bg-background-muted',
                  previewMetaClasses
                )
              "
            >
              <svg
                aria-hidden="true"
                class="h-8 w-8 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <template v-if="type === 'image'">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                </template>

                <path
                  d="m21 15-5-5L5 21"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
              </svg>
            </div>
            <span class="flex flex-col"
              ><span class="truncate text-sm font-medium">
                <template v-if="type === 'image'">
                  {{ imageName }}
                </template>

                <template v-else>
                  {{ videoName }}
                </template> </span
              ><span :class="cn('text-xs', previewMetaClasses)">
                <template v-if="type === 'image'">
                  {{ imageMeta }}
                </template>

                <template v-else>
                  {{ videoMeta }}
                </template>
              </span></span
            >
          </div>
        </template>

        <template v-if="showCustomText">
          <p :class="cn('mt-2 text-xs', previewMetaClasses)">
            {{ customText }}
          </p>
        </template>
      </div>
      <div class="flex items-center gap-1">
        <template v-if="showTime">
          <span :class="cn('text-xs', metaClasses)">{{ timeText }}</span>
        </template>

        <template v-if="showStatus || isError">
          <span
            :class="
              cn(
                'text-xs',
                isError
                  ? 'text-components-bubble-chat-error-color-status-foreground-default'
                  : metaClasses
              )
            "
            >{{ displayStatus }}</span
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "./utils";

export interface BubbleChatProps {
  direction?: "incoming" | "outgoing";
  type?: "text" | "file" | "image" | "video";
  messageState?: "default" | "error";
  text?: string;
  customText?: string;
  showCustomText?: boolean;
  showTime?: boolean;
  showStatus?: boolean;
  timeText?: string;
  statusText?: string;
  errorStatusText?: string;
  fileName?: string;
  fileMeta?: string;
  imageName?: string;
  imageMeta?: string;
  videoName?: string;
  videoMeta?: string;
  className?: string;
}

const props = withDefaults(defineProps<BubbleChatProps>(), {
  direction: "incoming",
  messageState: "default",
  errorStatusText: "Failed to send",
  statusText: "Received",
  className: "",
  type: "text",
  text: "Message",
  fileName: "document.pdf",
  fileMeta: "2.4 MB",
  videoName: "video.mp4",
  imageName: "image.jpg",
  videoMeta: "24.8 MB",
  imageMeta: "3.4 MB",
  showCustomText: false,
  customText: "Additional information",
  showTime: true,
  timeText: "10:24 AM",
  showStatus: false,
});

const isOutgoing = computed(() => {
  return props.direction === "outgoing";
});
const isError = computed(() => {
  return props.messageState === "error";
});
const bubbleClasses = computed(() => {
  if (isError) {
    return "bg-components-bubble-chat-error-color-container-background-default border border-components-bubble-chat-error-color-container-border-default text-components-bubble-chat-error-color-message-foreground-default";
  }
  if (isOutgoing) {
    return "bg-components-bubble-chat-outgoing-color-container-background-default text-components-bubble-chat-outgoing-color-message-foreground-default";
  }
  return "bg-components-bubble-chat-incoming-color-container-background-default text-components-bubble-chat-incoming-color-message-foreground-default";
});
const metaClasses = computed(() => {
  if (isError) {
    return "text-components-bubble-chat-error-color-metadata-foreground-default";
  }
  if (isOutgoing) {
    return "text-components-bubble-chat-outgoing-color-timestamp-foreground-default";
  }
  return "text-components-bubble-chat-incoming-color-timestamp-foreground-default";
});
const previewMetaClasses = computed(() => {
  if (isError) {
    return "text-components-bubble-chat-error-color-metadata-foreground-default";
  }
  return "text-foreground-muted";
});
const displayStatus = computed(() => {
  return isError ? props.errorStatusText : props.statusText;
});
</script>