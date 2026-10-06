<script context="module" lang="ts">
  export interface AvatarProps {
    showStatus?: boolean;
    initialsText?: string;
    size?: "mini" | "small" | "regular" | "large" | "x-large";
    type?: "image" | "initials" | "icon";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
  }
</script>

<script lang="ts">
  export let id: AvatarProps["id"];
  export let ariaDescribedby: AvatarProps["ariaDescribedby"];
  export let size: AvatarProps["size"];
  export let type: AvatarProps["type"];
  export let className: AvatarProps["className"];
  export let showStatus: AvatarProps["showStatus"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row justify-center items-center rounded-full " +
    (size === "small"
      ? "px-3 py-1.5 text-xs"
      : size === "regular"
      ? "px-4 py-2 text-sm"
      : size === "large"
      ? "px-6 py-3 text-lg"
      : "") +
    " " +
    (type === "initials"
      ? "bg-[#f5f5f5] text-[#525252]"
      : type === "icon"
      ? "bg-[#f5f5f5]"
      : "") +
    (className ? " " + className : "")}
>
  {#if showStatus !== false}
    <div class="bg-[#22c55e] border-2 border-white" />
  {/if}<slot />
</div>