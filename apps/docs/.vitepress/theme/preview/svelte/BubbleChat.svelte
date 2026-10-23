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
  import { cn } from "./utils";

  export let direction: BubbleChatProps["direction"] = "incoming";
  export let messageState: BubbleChatProps["messageState"] = "default";
  export let errorStatusText: BubbleChatProps["errorStatusText"] =
    "Failed to send";
  export let statusText: BubbleChatProps["statusText"] = "Received";
  export let className: BubbleChatProps["className"] = "";
  export let type: BubbleChatProps["type"] = "text";
  export let text: BubbleChatProps["text"] = "Message";
  export let fileName: BubbleChatProps["fileName"] = "document.pdf";
  export let fileMeta: BubbleChatProps["fileMeta"] = "2.4 MB";
  export let videoName: BubbleChatProps["videoName"] = "video.mp4";
  export let imageName: BubbleChatProps["imageName"] = "image.jpg";
  export let videoMeta: BubbleChatProps["videoMeta"] = "24.8 MB";
  export let imageMeta: BubbleChatProps["imageMeta"] = "3.4 MB";
  export let showCustomText: BubbleChatProps["showCustomText"] = false;
  export let customText: BubbleChatProps["customText"] =
    "Additional information";
  export let showTime: BubbleChatProps["showTime"] = true;
  export let timeText: BubbleChatProps["timeText"] = "10:24 AM";
  export let showStatus: BubbleChatProps["showStatus"] = false;

  $: isOutgoing = () => {
    return direction === "outgoing";
  };
  $: isError = () => {
    return messageState === "error";
  };
  $: bubbleClasses = () => {
    if (isError()) {
      return "bg-components-bubble-chat-error-color-container-background-default border border-components-bubble-chat-error-color-container-border-default text-components-bubble-chat-error-color-message-foreground-default";
    }
    if (isOutgoing()) {
      return "bg-components-bubble-chat-outgoing-color-container-background-default text-components-bubble-chat-outgoing-color-message-foreground-default";
    }
    return "bg-components-bubble-chat-incoming-color-container-background-default text-components-bubble-chat-incoming-color-message-foreground-default";
  };
  $: metaClasses = () => {
    if (isError()) {
      return "text-components-bubble-chat-error-color-metadata-foreground-default";
    }
    if (isOutgoing()) {
      return "text-components-bubble-chat-outgoing-color-timestamp-foreground-default";
    }
    return "text-components-bubble-chat-incoming-color-timestamp-foreground-default";
  };
  $: previewMetaClasses = () => {
    if (isError()) {
      return "text-components-bubble-chat-error-color-metadata-foreground-default";
    }
    return "text-foreground-muted";
  };
  $: displayStatus = () => {
    return isError() ? errorStatusText : statusText;
  };
</script>

<div
  class={cn(
    "flex w-full",
    isOutgoing() ? "justify-end" : "justify-start",
    className
  )}
>
  <div class={cn("flex max-w-xs flex-col gap-1", isOutgoing() && "items-end")}>
    <div class={cn("rounded-rounded-2xl px-4 py-3", bubbleClasses())}>
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
              d="M14 3v5h5"
              stroke-linecap="round"
              stroke-linejoin="round"
            /><path
              d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          ><span class="flex flex-col"
            ><span class="truncate text-sm font-medium">{fileName}</span><span
              class={cn("text-xs", previewMetaClasses())}>{fileMeta}</span
            ></span
          >
        </div>
      {/if}
      {#if type === "image" || type === "video"}
        <div class="flex flex-col gap-2">
          <div
            class={cn(
              "flex h-32 w-60 items-center justify-center rounded-rounded-xl bg-background-muted",
              previewMetaClasses()
            )}
          >
            <svg
              aria-hidden="true"
              class="h-8 w-8 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              {#if type === "image"}
                <rect x="3" y="3" width="18" height="18" rx="2" />
              {/if}<path
                d="m21 15-5-5L5 21"
                stroke-linecap="round"
                stroke-linejoin="round"
              /><circle cx="8.5" cy="8.5" r="1.5" /></svg
            >
          </div>
          <span class="flex flex-col"
            ><span class="truncate text-sm font-medium">
              {#if type === "image"}
                {imageName}
              {:else}
                {videoName}
              {/if}</span
            ><span class={cn("text-xs", previewMetaClasses())}>
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
        <p class={cn("mt-2 text-xs", previewMetaClasses())}>{customText}</p>
      {/if}
    </div>
    <div class="flex items-center gap-1">
      {#if showTime}
        <span class={cn("text-xs", metaClasses())}>{timeText}</span>
      {/if}
      {#if showStatus || isError()}
        <span
          class={cn(
            "text-xs",
            isError()
              ? "text-components-bubble-chat-error-color-status-foreground-default"
              : metaClasses()
          )}>{displayStatus()}</span
        >
      {/if}
    </div>
  </div>
</div>