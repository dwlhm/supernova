<script context="module" lang="ts">
  export interface ToggleGroupItemProps {
    size?: "small" | "medium" | "large";
    pressed?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;

    onPressedChange?: (pressed: boolean) => void;
  }
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, bindControllerProps } from "./utils";

  export let disabled: ToggleGroupItemProps["disabled"] = false;
  export let pressed: ToggleGroupItemProps["pressed"] = false;
  export let ariaLabel: ToggleGroupItemProps["ariaLabel"] = "Toggle option";
  export let size: ToggleGroupItemProps["size"] = "medium";
  export let className: ToggleGroupItemProps["className"] = "";
  export let onPressedChange: ToggleGroupItemProps["onPressedChange"];
</script>

<button
  type="button"
  data-ctrl={typeof bindControllerProps}
  {disabled}
  aria-pressed={pressed}
  aria-label={ariaLabel}
  class={cn(
    "inline-flex flex-row items-center justify-center gap-1 border-l border-border-default first:border-l-0 font-paragraph-weight-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
    cva(
      size,
      {
        small: "h-5 min-w-5 px-0.5 py-1 text-xs",
        medium: "h-6 min-w-6 px-1 py-1 text-xs",
        large: "h-9 min-w-9 px-2 py-2 text-sm",
      },
      "medium"
    ),
    pressed
      ? "bg-background-muted text-foreground-default"
      : "bg-background-default text-foreground-muted hover:bg-background-subtle hover:text-foreground-default",
    className
  )}
  on:click={(event) => {
    !disabled && onPressedChange && onPressedChange(!pressed);
  }}><slot /></button
>