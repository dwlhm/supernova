<script context="module" lang="ts">
  export interface TabsProps {
    ariaLabel?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let ariaLabel: TabsProps["ariaLabel"] = "Tabs";
  export let className: TabsProps["className"] = "";
</script>

<div
  role="tablist"
  data-ctrl={typeof bindControllerProps}
  aria-label={ariaLabel}
  class={cn(
    "inline-flex h-9 flex-row items-center justify-center rounded-xl bg-background-muted p-0.5",
    className
  )}
>
  <slot />
</div>