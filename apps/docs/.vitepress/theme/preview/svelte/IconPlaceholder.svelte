<script context="module" lang="ts">
  export interface IconPlaceholderProps {
    size?: number;
    ariaLabel?: string;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn, bindControllerProps } from "./utils";

  export let ariaLabel: IconPlaceholderProps["ariaLabel"] = "Placeholder icon";
  export let size: IconPlaceholderProps["size"] = 12;
  export let className: IconPlaceholderProps["className"] = "";
</script>

<svg
  role="img"
  viewBox="0 0 12 12"
  fill="none"
  stroke="currentColor"
  stroke-width="1"
  data-ctrl={typeof bindControllerProps}
  aria-label={ariaLabel}
  width={size}
  height={size}
  class={cn("inline-block shrink-0 text-foreground-muted", className)}
  ><circle cx="6" cy="6" r="5" /></svg
>