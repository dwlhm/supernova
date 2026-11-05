<script context="module" lang="ts">
  export interface SpinnerProps {
    size?: "12" | "16" | "24" | "32";
    label?: string;
    className?: string;
  }
</script>

<script lang="ts">
  import { cn, cva, bindControllerProps } from "./utils";

  export let className: SpinnerProps["className"] = "";
  export let size: SpinnerProps["size"] = "12";
  export let label: SpinnerProps["label"] = "Loading";
</script>

<span
  role="status"
  aria-live="polite"
  data-ctrl={typeof bindControllerProps}
  class={cn("inline-flex items-center justify-center", className)}
  ><svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    class={cn(
      "animate-spin text-primary-default",
      cva(
        size,
        {
          "12": "h-3 w-3",
          "16": "h-4 w-4",
          "24": "h-6 w-6",
          "32": "h-8 w-8",
        },
        "12"
      )
    )}
    ><circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="2"
      class="opacity-25"
    /><path
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    /></svg
  ><span class="sr-only">{label}</span></span
>