<script context="module" lang="ts">
  export interface RadioButtonProps {
    leftLabel?: boolean;
    rightLabel?: boolean;
    state?: "off" | "on" | "Disabled";
    disabled?: boolean;
    size?: "Medium" | "Small" | "Large";
    onClick?: (event?: any) => void;
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    leftLabelContent?: string;
    rightLabelContent?: string;
  }
</script>

<script lang="ts">
  export let onClick: RadioButtonProps["onClick"];
  export let disabled: RadioButtonProps["disabled"];
  export let state: RadioButtonProps["state"];
  export let id: RadioButtonProps["id"];
  export let ariaDescribedby: RadioButtonProps["ariaDescribedby"];
  export let ariaLabel: RadioButtonProps["ariaLabel"];
  export let ariaLabelledby: RadioButtonProps["ariaLabelledby"];
  export let size: RadioButtonProps["size"];
  export let className: RadioButtonProps["className"];
  export let leftLabel: RadioButtonProps["leftLabel"];
  export let leftLabelContent: RadioButtonProps["leftLabelContent"];
  export let rightLabel: RadioButtonProps["rightLabel"];
  export let rightLabelContent: RadioButtonProps["rightLabelContent"];
</script>

<button
  type="button"
  on:click={(e) => {
    onClick?.(e);
  }}
  disabled={disabled || state === "Disabled"}
  {id}
  aria-describedby={ariaDescribedby}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  class={"flex flex-row gap-2 items-center cursor-pointer transition-colors " +
    (size === "Medium"
      ? "px-4 py-2 text-sm"
      : size === "Large"
      ? "px-6 py-3 text-lg"
      : "px-3 py-1.5 text-xs") +
    (className ? " " + className : "")}
>
  {#if leftLabel}
    <p class="text-sm font-normal text-[#0a0a0a]">
      {leftLabelContent ?? "Label"}
    </p>
  {/if}
  <div
    class="rounded-full bg-background-page border border-[#e5e5e5] shadow-sm"
  />
  {#if rightLabel}
    <p class="text-sm font-normal text-[#0a0a0a]">
      {rightLabelContent ?? "Label"}
    </p>
  {/if}</button
>