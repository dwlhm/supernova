<script context="module" lang="ts">
  export interface AvatarProps {
    size?: "mini" | "small" | "regular" | "large" | "x-large";
    type?: "image" | "initials" | "icon";
    showStatus?: boolean;
    initialsText?: string;
    src?: string;
    alt?: string;
    status?: "online" | "offline" | "busy" | "away";
    className?: string;
  }
</script>

<script lang="ts">
  import { cn, cva, getAvatarState, bindControllerProps } from "./utils";

  export let size: AvatarProps["size"] = "mini";
  export let className: AvatarProps["className"] = "";
  export let type: AvatarProps["type"] = "image";
  export let src: AvatarProps["src"] = "";
  export let initialsText: AvatarProps["initialsText"] = "AB";
  export let showStatus: AvatarProps["showStatus"] = true;
  export let status: AvatarProps["status"] = "online";
  export let alt: AvatarProps["alt"] = '';
  $: props = { size, className, type, src, initialsText, showStatus, status, alt };
</script>

<span
  role="img"
  data-ctrl={typeof bindControllerProps}
  aria-label={getAvatarState(props).accessibleName}
  class={cn(
    "relative inline-flex shrink-0 items-center justify-center rounded-full bg-background-muted",
    cva(
      size,
      {
        mini: "h-6 w-6 text-xs",
        small: "h-8 w-8 text-xs",
        regular: "h-9 w-9 text-sm",
        large: "h-10 w-10 text-base",
        "x-large": "h-14 w-14 text-lg",
      },
      "mini"
    ),
    className
  )}
>
  {#if type === "image" && Boolean(src)}
    <img alt="" class="h-full w-full rounded-full object-cover" {src} />
  {/if}
  {#if type === "icon" || (type === "image" && !src)}
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      class={cn(
        "shrink-0 text-foreground-subtle",
        cva(
          size,
          {
            mini: "h-3 w-3",
            small: "h-4 w-4",
            regular: "h-4 w-4",
            large: "h-5 w-5",
            "x-large": "h-7 w-7",
          },
          "mini"
        )
      )}
      ><circle cx="12" cy="8" r="3.5" /><path
        d="M4.5 20a7.5 7.5 0 0 1 15 0"
        stroke-linecap="round"
      /></svg
    >
  {/if}
  {#if type === "initials"}
    <span
      aria-hidden="true"
      class="font-medium uppercase leading-none text-foreground-subtle"
      >{initialsText}</span
    >
  {/if}
  {#if showStatus}
    <span
      aria-hidden="true"
      class={cn(
        "absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background-default",
        cva(
          status,
          {
            offline: "bg-background-interactive",
            busy: "bg-destructive-default",
            away: "bg-warning-default",
            online: "bg-success-default",
          },
          "online"
        )
      )}
    />
  {/if}</span
>