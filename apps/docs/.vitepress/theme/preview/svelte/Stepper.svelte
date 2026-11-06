<script context="module" lang="ts">
  export interface StepperProps {
    orientation?: "horizontal" | "vertical";
    ariaLabel?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let ariaLabel: StepperProps["ariaLabel"] = "Progress";
  export let className: StepperProps["className"] = "";
  export let orientation: StepperProps["orientation"] = "horizontal";
</script>

<nav
  data-ctrl={typeof bindControllerProps}
  aria-label={ariaLabel}
  class={cn("w-full bg-background-default", className)}
>
  <ol
    class={cn(
      "flex items-start justify-start",
      orientation === "vertical" ? "flex-col" : "w-full flex-row"
    )}
  >
    <slot />
  </ol>
</nav>