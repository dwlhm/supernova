<script context="module" lang="ts">
  export interface ToggleProps {
    showText?: boolean;
    state?: "Default" | "Active" | "Disabled";
    size?: "Medium" | "Large" | "Small";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    label?: string;
  }
</script>

<script lang="ts">
  export let id: ToggleProps["id"];
  export let ariaDescribedby: ToggleProps["ariaDescribedby"];
  export let size: ToggleProps["size"];
  export let className: ToggleProps["className"];
  export let showText: ToggleProps["showText"];
  export let label: ToggleProps["label"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row gap-1 justify-center items-center " +
    (size === "Medium"
      ? "p-1 text-xs"
      : size === "Large"
      ? "p-2 text-xs"
      : "p-1 text-xs") +
    (className ? " " + className : "")}
>
  <div>
    <div />
    <div class="border-1.5 border-[#0a0a0a]" />
    <div class="border-1.5 border-[#0a0a0a]" />
  </div>
  {#if showText}
    <p class="text-xs font-normal text-center text-[#0a0a0a]">
      {label ?? "Bold"}
    </p>
  {/if}<slot />
</div>