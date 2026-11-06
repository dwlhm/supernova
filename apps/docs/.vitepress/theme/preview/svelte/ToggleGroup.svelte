<script context="module" lang="ts">
  export interface ToggleGroupProps {
    size?: "small" | "medium" | "large";
    ariaLabel?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, bindControllerProps } from "./utils";

  export let size: ToggleGroupProps["size"] = "medium";
  export let ariaLabel: ToggleGroupProps["ariaLabel"] = "Toggle group";
  export let className: ToggleGroupProps["className"] = "";
</script>

<div
  role="group"
  data-ctrl={typeof bindControllerProps}
  data-size={size}
  aria-label={ariaLabel}
  class={cn(
    "inline-flex flex-row justify-start items-start overflow-hidden rounded-lg border border-border-default bg-background-default shadow-sm",
    cva(
      size,
      {
        small: "min-h-5",
        medium: "min-h-6",
        large: "min-h-9",
      },
      "medium"
    ),
    className
  )}
>
  <slot />
</div>