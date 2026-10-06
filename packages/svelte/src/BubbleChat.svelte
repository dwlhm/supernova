<script context="module" lang="ts">
  export interface BubbleChatProps {
    showTime?: boolean;
    showStatus?: boolean;
    showCustomText?: boolean;
    customText?: string;
    textMessage?: string;
    fileName?: string;
    fileMetadata?: string;
    imageName?: string;
    imageMetadata?: string;
    videoName?: string;
    videoMetadata?: string;
    incomingStatusText?: string;
    outgoingStatusText?: string;
    errorStatusText?: string;
    incomingTimeText?: string;
    outgoingTimeText?: string;
    direction?: "Incoming" | "Outgoing";
    type?: "Text" | "File" | "Image" | "Video";
    state?: "Default" | "Error";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: BubbleChatProps["id"];
  export let ariaDescribedby: BubbleChatProps["ariaDescribedby"];
  export let type: BubbleChatProps["type"];
  export let className: BubbleChatProps["className"];
  export let textMessage: BubbleChatProps["textMessage"];
  export let showCustomText: BubbleChatProps["showCustomText"];
  export let customText: BubbleChatProps["customText"];
  export let showStatus: BubbleChatProps["showStatus"];
  export let incomingStatusText: BubbleChatProps["incomingStatusText"];
  export let showTime: BubbleChatProps["showTime"];
  export let incomingTimeText: BubbleChatProps["incomingTimeText"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-1 px-4 py-3 rounded-2xl " +
    (type === "File"
      ? "bg-[#f5f5f5] text-[#0a0a0a]"
      : type === "Image"
      ? "bg-[#f5f5f5] text-[#0a0a0a]"
      : type === "Video"
      ? "bg-[#f5f5f5] text-[#0a0a0a]"
      : "bg-[#f5f5f5] text-[#0a0a0a]") +
    (className ? " " + className : "")}
>
  <p class="text-sm font-normal text-[#0a0a0a]">{textMessage ?? "Message"}</p>
  {#if showCustomText}
    <p class="text-xs font-normal text-right text-[#737373]">
      {customText ?? "Additional information"}
    </p>
  {/if}
  <div class="flex flex-row gap-1 justify-between items-center w-full">
    {#if showStatus}
      <p class="text-xs font-normal text-[#737373]">
        {incomingStatusText ?? "Received"}
      </p>
    {/if}
    {#if showTime !== false}
      <p class="text-xs font-normal text-right text-[#737373]">
        {incomingTimeText ?? "10:24 AM"}
      </p>
    {/if}
  </div>
  <slot />
</div>