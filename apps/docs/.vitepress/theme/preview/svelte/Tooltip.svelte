<script context="module" lang="ts">
  export interface TooltipProps {
    text?: string;
    position?: "top" | "bottom" | "left" | "right";
    id?: string;
    className?: string;
    children?: any;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let position: TooltipProps["position"] = "top";
  export let className: TooltipProps["className"] = "";

  export let id: TooltipProps["id"] = "tooltip";
  export let text: TooltipProps["text"] = "Label";

  $: positionClasses = () => {
    switch (position) {
      case "bottom":
        return "left-1/2 top-full mt-2 -translate-x-1/2";
      case "left":
        return "right-full top-1/2 mr-2 -translate-y-1/2";
      case "right":
        return "left-full top-1/2 ml-2 -translate-y-1/2";
      case "top":
      default:
        return "bottom-full left-1/2 mb-2 -translate-x-1/2";
    }
  };
</script>

<span class={cn("group relative inline-flex", className)}
  ><slot /><span
    role="tooltip"
    {id}
    class={cn(
      "pointer-events-none invisible absolute z-50 max-w-xs whitespace-nowrap rounded-rounded-lg bg-components-tooltip-accent-color-container-background-default px-2 py-1 text-xs font-medium text-components-tooltip-accent-color-label-text-default opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
      positionClasses()
    )}>{text}</span
  ></span
>