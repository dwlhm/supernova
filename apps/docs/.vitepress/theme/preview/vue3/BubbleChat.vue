<template>
  <div
    :data-ctrl="typeof bindControllerProps"
    :class="
      cn(
        'flex w-full',
        direction === 'outgoing' ? 'justify-end' : 'justify-start',
        className
      )
    "
  >
    <div
      :class="
        cn(
          'flex max-w-xs flex-col gap-1',
          direction === 'outgoing' && 'items-end'
        )
      "
    >
      <div
        :class="
          cn(
            'rounded-2xl p-4',
            messageState === 'error'
              ? 'border border-destructive-border bg-destructive-subtle text-destructive-foreground'
              : direction === 'outgoing'
              ? 'border border-border-default bg-background-default text-foreground-default'
              : 'bg-background-muted text-foreground-default'
          )
        "
      >
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
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="ICON_PATHS.file"
              ></path></svg
            ><span class="flex flex-col"
              ><span class="truncate text-sm font-medium">{{ fileName }}</span
              ><span
                :class="
                  cn(
                    'text-xs',
                    messageState === 'error'
                      ? 'text-destructive-foreground'
                      : 'text-foreground-muted'
                  )
                "
                >{{ fileMeta }}</span
              ></span
            >
          </div>
        </template>

        <template v-if="type === 'image' || type === 'video'">
          <div class="flex flex-col gap-2">
            <div
              :class="
                cn(
                  'flex h-32 w-60 items-center justify-center rounded-xl bg-background-subtle',
                  messageState === 'error'
                    ? 'text-destructive-foreground'
                    : 'text-foreground-muted'
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
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="type === 'image' ? ICON_PATHS.image : ICON_PATHS.video"
                ></path>
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
              ><span
                :class="
                  cn(
                    'text-xs',
                    messageState === 'error'
                      ? 'text-destructive-foreground'
                      : 'text-foreground-muted'
                  )
                "
              >
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
          <p
            :class="
              cn(
                'mt-2 text-xs',
                messageState === 'error'
                  ? 'text-destructive-foreground'
                  : 'text-foreground-muted'
              )
            "
          >
            {{ customText }}
          </p>
        </template>
      </div>
      <div class="flex w-full items-center justify-between gap-2">
        <template v-if="showTime">
          <span
            :class="
              cn(
                'text-xs',
                messageState === 'error'
                  ? 'text-destructive-foreground'
                  : 'text-foreground-muted'
              )
            "
            >{{ timeText }}</span
          >
        </template>

        <template v-if="showStatus || messageState === 'error'">
          <span
            :class="
              cn(
                'text-xs',
                messageState === 'error'
                  ? 'text-destructive-foreground'
                  : 'text-foreground-muted'
              )
            "
          >
            <template v-if="messageState === 'error'">
              {{ errorStatusText }}
            </template>

            <template v-else>
              {{ statusText }}
            </template>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn, ICON_PATHS, bindControllerProps } from "./utils";

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
  className: "",
  messageState: "default",
  type: "text",
  text: "Message",
  fileName: "document.pdf",
  fileMeta: "2.4 MB",
  videoName: "video.mp4",
  imageName: "image.jpg",
  videoMeta: "24.8 MB • 01:08",
  imageMeta: "3.4 MB",
  showCustomText: false,
  customText: "Additional information",
  showTime: true,
  timeText: "10:24 AM",
  showStatus: false,
  statusText: "Received",
  errorStatusText: "Failed to send",
});
</script>