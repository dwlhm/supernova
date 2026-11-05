<script context="module" lang="ts">
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
</script>

<script lang="ts">
  import { cn, ICON_PATHS, bindControllerProps } from "./utils";

  export let direction: BubbleChatProps["direction"] = "incoming";
  export let className: BubbleChatProps["className"] = "";
  export let messageState: BubbleChatProps["messageState"] = "default";
  export let type: BubbleChatProps["type"] = "text";
  export let text: BubbleChatProps["text"] = "Message";
  export let fileName: BubbleChatProps["fileName"] = "document.pdf";
  export let fileMeta: BubbleChatProps["fileMeta"] = "2.4 MB";
  export let videoName: BubbleChatProps["videoName"] = "video.mp4";
  export let imageName: BubbleChatProps["imageName"] = "image.jpg";
  export let videoMeta: BubbleChatProps["videoMeta"] = "24.8 MB • 01:08";
  export let imageMeta: BubbleChatProps["imageMeta"] = "3.4 MB";
  export let showCustomText: BubbleChatProps["showCustomText"] = false;
  export let customText: BubbleChatProps["customText"] =
    "Additional information";
  export let showTime: BubbleChatProps["showTime"] = true;
  export let timeText: BubbleChatProps["timeText"] = "10:24 AM";
  export let showStatus: BubbleChatProps["showStatus"] = false;
  export let statusText: BubbleChatProps["statusText"] = "Received";
  export let errorStatusText: BubbleChatProps["errorStatusText"] =
    "Failed to send";
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex w-full",
    direction === "outgoing" ? "justify-end" : "justify-start",
    className
  )}
>
  <div
    class={cn(
      "flex max-w-xs flex-col gap-1",
      direction === "outgoing" && "items-end"
    )}
  >
    <div
      class={cn(
        "rounded-2xl p-4",
        messageState === "error"
          ? "border border-destructive-border bg-destructive-subtle text-destructive-foreground"
          : direction === "outgoing"
          ? "border border-border-default bg-background-default text-foreground-default"
          : "bg-background-muted text-foreground-default"
      )}
    >
      {#if type === "text"}
        <p class="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
      {/if}
      {#if type === "file"}
        <div class="flex items-center gap-2">
          <svg
            aria-hidden="true"
            class="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d={ICON_PATHS.file}
            /></svg
          ><span class="flex flex-col"
            ><span class="truncate text-sm font-medium">{fileName}</span><span
              class={cn(
                "text-xs",
                messageState === "error"
                  ? "text-destructive-foreground"
                  : "text-foreground-muted"
              )}>{fileMeta}</span
            ></span
          >
        </div>
      {/if}
      {#if type === "image" || type === "video"}
        <div class="flex flex-col gap-2">
          <div
            class={cn(
              "flex h-32 w-60 items-center justify-center rounded-xl bg-background-subtle",
              messageState === "error"
                ? "text-destructive-foreground"
                : "text-foreground-muted"
            )}
          >
            <svg
              aria-hidden="true"
              class="h-8 w-8 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                d={type === "image" ? ICON_PATHS.image : ICON_PATHS.video}
              /></svg
            >
          </div>
          <span class="flex flex-col"
            ><span class="truncate text-sm font-medium">
              {#if type === "image"}
                {imageName}
              {:else}
                {videoName}
              {/if}</span
            ><span
              class={cn(
                "text-xs",
                messageState === "error"
                  ? "text-destructive-foreground"
                  : "text-foreground-muted"
              )}
            >
              {#if type === "image"}
                {imageMeta}
              {:else}
                {videoMeta}
              {/if}</span
            ></span
          >
        </div>
      {/if}
      {#if showCustomText}
        <p
          class={cn(
            "mt-2 text-xs",
            messageState === "error"
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}
        >
          {customText}
        </p>
      {/if}
    </div>
    <div class="flex w-full items-center justify-between gap-2">
      {#if showTime}
        <span
          class={cn(
            "text-xs",
            messageState === "error"
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}>{timeText}</span
        >
      {/if}
      {#if showStatus || messageState === "error"}
        <span
          class={cn(
            "text-xs",
            messageState === "error"
              ? "text-destructive-foreground"
              : "text-foreground-muted"
          )}
        >
          {#if messageState === "error"}
            {errorStatusText}
          {:else}
            {statusText}
          {/if}</span
        >
      {/if}
    </div>
  </div>
</div>