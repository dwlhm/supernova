<script context="module" lang="ts">
  export interface ToggleProps {
    pressed?: boolean;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    showText?: boolean;
    label?: string;
    className?: string;
    children?: any;
    ariaLabel?: string;
    onPressedChange?: (pressed: boolean) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let size: ToggleProps["size"] = "medium";
  export let pressed: ToggleProps["pressed"] = false;
  export let disabled: ToggleProps["disabled"] = false;
  export let onPressedChange: ToggleProps["onPressedChange"];
  export let ariaLabel: ToggleProps["ariaLabel"] = "";
  export let label: ToggleProps["label"] = "Toggle";
  export let className: ToggleProps["className"] = "";

  export let showText: ToggleProps["showText"] = false;

  function handleToggle() {
    if (disabled) {
      return;
    }
    if (onPressedChange) {
      onPressedChange(!pressed);
    }
  }
  $: sizeClasses = () => {
    switch (size) {
      case "small":
        return "p-0.5 gap-0.5 text-xs";
      case "large":
        return "p-2 gap-1 text-base";
      case "medium":
      default:
        return "p-1 gap-1 text-sm";
    }
  };
  $: iconClasses = () => {
    switch (size) {
      case "small":
        return "h-3 w-3";
      case "large":
        return "h-5 w-5";
      case "medium":
      default:
        return "h-4 w-4";
    }
  };
  $: pressedClasses = () => {
    return pressed
      ? "bg-components-toggle-active-color-container-background-default"
      : "bg-transparent";
  };
</script>

<button
  type="button"
  aria-pressed={pressed}
  aria-label={ariaLabel !== "" ? ariaLabel : label}
  {disabled}
  class={cn(
    "inline-flex items-center justify-center rounded-rounded-lg text-components-toggle-all-color-label-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
    sizeClasses(),
    pressedClasses(),
    className
  )}
  on:click={(event) => {
    handleToggle();
  }}
>
  {#if $$slots.default}
    <slot />
  {/if}
  {#if !$$slots.default}
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      class={cn("shrink-0", iconClasses())}
      ><path d="M12 3v18M3 12h18" stroke-linecap="round" /></svg
    >
  {/if}
  {#if showText}
    <span class="truncate">{label}</span>
  {/if}</button
>