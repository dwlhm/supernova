<script context="module" lang="ts">
  export interface ChartLegendEntry {
    label: string;
    colorClass: string;
  }

  export interface ChartDataPoint {
    label: string;
    value?: number;
    values?: number[];
  }

  export interface ChartProps {
    title?: string;
    description?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let className: ChartProps["className"] = "";
  export let title: ChartProps["title"] = "";
  export let description: ChartProps["description"] = "";
</script>

<figure
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex w-full flex-col items-start justify-start gap-4 rounded-lg border border-border-default bg-background-default px-5 py-5 shadow-sm",
    className
  )}
>
  {#if title || description}
    <figcaption class="flex flex-col items-start justify-start gap-1">
      {#if title}
        <span class="text-base leading-6 font-semibold text-foreground-default"
          >{title}</span
        >
      {/if}
      {#if description}
        <span class="text-sm font-normal text-foreground-muted"
          >{description}</span
        >
      {/if}
    </figcaption>
  {/if}<slot />
</figure>