<script context="module" lang="ts">
  export interface FABProps {
    variant?: "primary" | "secondary" | "outline";
    size?: "small" | "regular" | "large" | "extended";
    disabled?: boolean;
    label?: string;
    showLabel?: boolean;
    ariaLabel?: string;
    className?: string;
    children?: any;
    onClick?: () => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let variant: FABProps["variant"] = "primary";
  export let size: FABProps["size"] = "regular";
  export let ariaLabel: FABProps["ariaLabel"] = "";
  export let label: FABProps["label"] = "Label";
  export let disabled: FABProps["disabled"] = false;
  export let onClick: FABProps["onClick"];
  export let className: FABProps["className"] = "";

  export let showLabel: FABProps["showLabel"] = true;

  function handleClick() {
    if (!disabled && onClick) {
      onClick();
    }
  }
  $: variantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-components-fab-secondary-color-container-background-default text-components-fab-secondary-color-label-foreground-default hover:bg-components-fab-secondary-color-container-background-hover";
      case "outline":
        return "bg-components-fab-surface-color-container-background-default text-components-fab-surface-color-label-foreground-default border border-border-default hover:bg-components-fab-surface-color-container-background-hover";
      case "primary":
      default:
        return "bg-components-fab-primary-color-container-background-default text-components-fab-primary-color-label-foreground-default hover:bg-components-fab-primary-color-container-background-hover";
    }
  };
  $: sizeClasses = () => {
    switch (size) {
      case "small":
        return "h-10 w-10";
      case "large":
        return "h-24 w-24";
      case "extended":
        return "h-14 w-auto gap-3 px-4";
      case "regular":
      default:
        return "h-14 w-14";
    }
  };
  $: iconClasses = () => {
    switch (size) {
      case "small":
        return "h-4 w-4";
      case "large":
        return "h-7 w-7";
      case "regular":
      case "extended":
      default:
        return "h-5 w-5";
    }
  };
  $: accessibleName = () => {
    return ariaLabel !== "" ? ariaLabel : label;
  };
</script>

<button
  type="button"
  aria-label={accessibleName()}
  {disabled}
  class={cn(
    "inline-flex shrink-0 items-center justify-center rounded-rounded-full shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
    variantClasses(),
    sizeClasses(),
    className
  )}
  on:click={(event) => {
    handleClick();
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
      ><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg
    >
  {/if}
  {#if size === "extended" && showLabel}
    <span class="truncate text-sm font-medium">{label}</span>
  {/if}</button
>