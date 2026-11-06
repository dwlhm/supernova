<script context="module" lang="ts">
  export interface BreadcrumbItemProps {
    href?: string;
    isCurrent?: boolean;
    isEllipsis?: boolean;
    className?: string;

    onNavigate?: (href: string) => void;
  }
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let className: BreadcrumbItemProps["className"] = "";
  export let isEllipsis: BreadcrumbItemProps["isEllipsis"] = false;
  export let isCurrent: BreadcrumbItemProps["isCurrent"] = false;

  export let href: BreadcrumbItemProps["href"] = "#";
  export let onNavigate: BreadcrumbItemProps["onNavigate"];
</script>

<li
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex flex-row justify-center items-center gap-1.5 text-sm font-normal",
    className
  )}
>
  {#if isEllipsis}
    <span
      class="inline-flex items-center justify-center w-3.5 h-3.5 text-foreground-muted"
      aria-hidden="true"
      ><svg
        class="w-3.5 h-3.5"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        ><circle cx="3" cy="7" r="1" /><circle cx="7" cy="7" r="1" /><circle
          cx="11"
          cy="7"
          r="1"
        /></svg
      ></span
    >
  {/if}
  {#if !isEllipsis && isCurrent}
    <span
      aria-current="page"
      class="flex flex-row justify-center items-center gap-2.5 text-sm font-normal text-foreground-default"
      ><slot /></span
    >
  {/if}
  {#if !isEllipsis && !isCurrent}
    <a
      class="flex flex-row justify-center items-center gap-2.5 rounded-sm text-sm font-normal text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
      {href}
      on:click={(event) => {
        onNavigate && onNavigate(href || "#");
      }}><slot /></a
    >
  {/if}
  {#if !isCurrent}
    <span class="text-sm font-normal text-foreground-muted" aria-hidden="true"
      >/</span
    >
  {/if}
</li>