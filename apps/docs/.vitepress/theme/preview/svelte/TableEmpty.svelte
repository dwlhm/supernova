<script context="module" lang="ts">
  export interface TableEmptyProps {
    title?: string;
    description?: string;
    ctaLabel?: string;
    showIcon?: boolean;
    className?: string;
    onCtaClick?: () => void;
  }
</script>

<script lang="ts">
  import { cn, ICON_PATHS, bindControllerProps } from "./utils";

  export let className: TableEmptyProps["className"] = "";
  export let showIcon: TableEmptyProps["showIcon"] = true;
  export let title: TableEmptyProps["title"] = "";
  export let description: TableEmptyProps["description"] = "";
  export let ctaLabel: TableEmptyProps["ctaLabel"] = "";
  export let onCtaClick: TableEmptyProps["onCtaClick"];
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex flex-col items-center justify-center gap-4 rounded-lg bg-background-default px-8 py-10 text-center",
    className
  )}
>
  {#if showIcon}
    <span
      class="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-background-muted"
      aria-hidden="true"
      ><svg
        class="h-6 w-6 text-foreground-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d={ICON_PATHS.search}
        /></svg
      ></span
    >
  {/if}
  <div class="flex flex-col items-center justify-center gap-2">
    {#if title}
      <span class="text-center text-base font-semibold text-foreground-default"
        >{title}</span
      >
    {/if}
    {#if description}
      <span
        class="max-w-sm text-center text-sm font-normal text-foreground-muted"
        >{description}</span
      >
    {/if}
  </div>
  {#if ctaLabel}
    <button
      type="button"
      class="flex flex-row items-center justify-center gap-2 rounded-lg bg-secondary-default px-4 py-2 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
      on:click={(event) => {
        onCtaClick && onCtaClick();
      }}>{ctaLabel}</button
    >
  {/if}
</div>