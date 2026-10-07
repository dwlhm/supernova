<script context="module" lang="ts">
  export interface CheckboxProps {
    leftLabel?: boolean;
    rightLabel?: boolean;
    state?: "off" | "on";
    State?: "off" | "on";
    size?: "Medium" | "Small" | "Large";
    Size?: "Medium" | "Small" | "Large";
    disabled?: "false" | "true";
    Disabled?: "false" | "true";
    children?: any;
    className?: string;
  }
</script>

<script lang="ts">
  export let size: CheckboxProps["size"];
  export let className: CheckboxProps["className"];
  export let leftLabel: CheckboxProps["leftLabel"];
  export let rightLabel: CheckboxProps["rightLabel"];
</script>

<div
  class={"flex flex-row gap-2 items-center " +
    (size === "Medium"
      ? "px-4 py-2 text-sm"
      : size === "Large"
      ? "px-6 py-3 text-lg"
      : "px-3 py-1.5 text-xs") +
    (className ? " " + className : "")}
>
  {#if leftLabel}
    <p class="text-sm font-normal text-[#0a0a0a]">Label</p>
  {/if}
  <div class="rounded-md bg-[#e55514]">
    <div><div class="border border-[var(--color-white)]" /></div>
  </div>
  {#if rightLabel}
    <p class="text-sm font-normal text-[#0a0a0a]">Label</p>
  {/if}<slot />
</div>