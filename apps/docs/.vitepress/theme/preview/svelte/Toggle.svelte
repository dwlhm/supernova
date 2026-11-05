<script context="module" lang="ts">
  export interface ToggleProps {
    pressed?: boolean;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    showText?: boolean;
    label?: string;
    className?: string;

    ariaLabel?: string;
    onPressedChange?: (pressed: boolean) => void;
  }
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, ICON_PATHS, bindControllerProps } from "./utils";

  export let pressed: ToggleProps["pressed"] = false;
  export let ariaLabel: ToggleProps["ariaLabel"] = "";
  export let label: ToggleProps["label"] = "Toggle";
  export let disabled: ToggleProps["disabled"] = false;
  export let showText: ToggleProps["showText"] = false;
  export let size: ToggleProps["size"] = "medium";
  export let className: ToggleProps["className"] = "";
  export let onPressedChange: ToggleProps["onPressedChange"];
</script>

<button
  type="button"
  data-ctrl={typeof bindControllerProps}
  aria-pressed={pressed}
  aria-label={ariaLabel !== "" ? ariaLabel : label}
  {disabled}
  class={cn(
    "inline-flex items-center justify-center rounded-lg text-foreground-default transition-colors hover:bg-background-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
    showText
      ? cva(
          size,
          {
            small: "px-2 py-1 gap-1.5 text-xs",
            medium: "px-3 py-1.5 gap-2 text-sm",
            large: "px-4 py-2 gap-2.5 text-base",
          },
          "medium"
        )
      : cva(
          size,
          {
            small: "h-4 w-4 p-0.5",
            medium: "h-6 w-6 p-1",
            large: "h-9 w-9 p-2",
          },
          "medium"
        ),
    pressed ? "bg-background-muted shadow-xs" : "bg-transparent",
    className
  )}
  on:click={(event) => {
    !disabled && onPressedChange && onPressedChange(!pressed);
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
      class={cn(
        "shrink-0",
        cva(
          size,
          {
            small: "h-3 w-3",
            medium: "h-4 w-4",
            large: "h-5 w-5",
          },
          "medium"
        )
      )}><path stroke-linecap="round" d={ICON_PATHS.plus} /></svg
    >
  {/if}
  {#if showText}
    <span class="truncate font-medium">{label}</span>
  {/if}</button
>