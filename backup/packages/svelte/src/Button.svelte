<script context="module" lang="ts">
  export interface ButtonProps {
    showLeftIcon?: boolean;
    Showlefticon?: boolean;
    showRightIcon?: boolean;
    Showrighticon?: boolean;
    leftIcon?: any;
    Lefticon?: any;
    rightIcon?: any;
    Righticon?: any;
    label?: string;
    Label?: string;
    showLabel?: boolean;
    ShowLabel?: boolean;
    roundness?: "Default" | "Round";
    Roundness?: "Default" | "Round";
    variant?: "Primary" | "Secondary" | "Outline" | "Destructive" | "Link";
    Style?: "Primary" | "Secondary" | "Outline" | "Destructive" | "Link";
    size?: "Regular" | "Large" | "Small" | "Mini";
    Size?: "Regular" | "Large" | "Small" | "Mini";
    state?: "Default" | "Focus" | "Disabled" | "Pressed";
    State?: "Default" | "Focus" | "Disabled" | "Pressed";
    onClick?: (event?: any) => void;
    children?: any;
    className?: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  export let onClick: ButtonProps["onClick"];
  export let disabled: ButtonProps["disabled"];
  export let state: ButtonProps["state"];
  export let variant: ButtonProps["variant"];
  export let size: ButtonProps["size"];
  export let className: ButtonProps["className"];
  export let showLeftIcon: ButtonProps["showLeftIcon"];
  export let label: ButtonProps["label"];

  export let showRightIcon: ButtonProps["showRightIcon"];
</script>

<button
  on:click={(e) => {
    onClick?.(e);
  }}
  disabled={disabled || state === "Disabled"}
  class={"flex flex-row gap-2 justify-center items-center rounded-lg cursor-pointer transition-colors focus:outline-none " +
    (variant === "Secondary"
      ? "bg-[#f5f5f5] text-[#171717]"
      : variant === "Outline"
      ? "bg-white border border-[#e5e5e5] text-[#0a0a0a]"
      : variant === "Destructive"
      ? "bg-[#dc2626] text-white"
      : variant === "Link"
      ? "bg-white text-[#cc4b12]"
      : "bg-[#e55514] text-white") +
    " " +
    (size === "Large"
      ? "px-6 py-3 text-sm"
      : size === "Small"
      ? "px-3 py-1 text-sm"
      : size === "Mini"
      ? "px-2 py-1 text-sm"
      : "px-4 py-2 text-sm") +
    (className ? " " + className : "")}
>
  {#if showLeftIcon}
    <div class="flex flex-row justify-center items-center">
      <div><div class="border-[var(--color-white)]" /></div>
    </div>
  {/if}{label || $$slots.default || "Button"}
  {#if showRightIcon}
    <div class="flex flex-row justify-center items-center">
      <div><div class="border-[var(--color-white)]" /></div>
    </div>
  {/if}</button
>