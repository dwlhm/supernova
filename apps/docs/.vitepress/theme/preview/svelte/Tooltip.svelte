<script context="module" lang="ts">
  export interface TooltipProps {
    text?: string;
    position?: "top" | "bottom" | "left" | "right";
    id?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, bindControllerProps } from "./utils";

  export let id: TooltipProps["id"] = "tooltip";
  export let className: TooltipProps["className"] = "";

  export let position: TooltipProps["position"] = "top";
  export let text: TooltipProps["text"] = "Label";
</script>

<span
  data-ctrl={typeof bindControllerProps}
  aria-describedby={id}
  class={cn(
    "group relative inline-flex items-center justify-center",
    className
  )}
>
  {#if $$slots.default}
    <slot />
  {/if}
  {#if !$$slots.default}
    <button
      type="button"
      class="inline-flex h-8 items-center justify-center rounded-lg border border-border-default bg-background-subtle px-3 text-xs font-medium text-foreground-default"
      aria-describedby={id}
    >
      Hover target
    </button>
  {/if}<span
    role="tooltip"
    {id}
    class={cn(
      "pointer-events-none absolute z-50 max-w-xs whitespace-nowrap rounded-md bg-foreground-default px-3 py-2 text-sm font-normal text-background-default shadow-md transition-opacity",
      $$slots.default
        ? "invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        : "visible opacity-100",
      cva(
        position,
        {
          bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
          left: "right-full top-1/2 mr-2 -translate-y-1/2",
          right: "left-full top-1/2 ml-2 -translate-y-1/2",
          top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
        },
        "top"
      )
    )}>{text}</span
  ></span
>