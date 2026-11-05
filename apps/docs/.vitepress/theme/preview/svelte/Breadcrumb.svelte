<script context="module" lang="ts">
  export interface BreadcrumbItem {
    label: string;
    href?: string;
  }

  export interface BreadcrumbEntry {
    key: string;
    label: string;
    href: string;
    isEllipsis: boolean;
    isCurrent: boolean;
    originalIndex: number;
  }

  export interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    type?: "1" | "2" | "deep";
    showEllipsis?: boolean;
    maxItems?: number;
    className?: string;

    onNavigate?: (href: string, index: number) => void;
  }
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, getBreadcrumbState, bindControllerProps } from "./utils";

  export let className: BreadcrumbProps["className"] = "";

  export let onNavigate: BreadcrumbProps["onNavigate"];
  export let items: BreadcrumbProps["items"] = [];
  export let type: BreadcrumbProps["type"] = '2';
  export let showEllipsis: BreadcrumbProps["showEllipsis"] = true;
  export let maxItems: BreadcrumbProps["maxItems"] = 4;
  $: props = { className, onNavigate, items, type, showEllipsis, maxItems };
</script>

<nav
  aria-label="Breadcrumb"
  data-ctrl={typeof bindControllerProps}
  class={cn("w-full", className)}
>
  <ol class="flex flex-wrap items-center gap-1.5 text-sm">
    {#if $$slots.default}
      <slot />
    {/if}
    {#if !$$slots.default}
      {#each getBreadcrumbState(props) as item (item.key)}
        <li class="flex items-center gap-1.5">
          {#if item.isEllipsis}
            <span class="px-1 text-foreground-muted" aria-hidden="true"
              >{item.label}</span
            >
          {/if}
          {#if !item.isEllipsis && item.isCurrent}
            <span
              aria-current="page"
              class="font-normal text-foreground-default">{item.label}</span
            >
          {/if}
          {#if !item.isEllipsis && !item.isCurrent}
            <a
              class="rounded-sm text-foreground-muted transition-colors hover:text-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
              href={item.href}
              on:click={(event) => {
                onNavigate && onNavigate(item.href, item.originalIndex);
              }}>{item.label}</a
            >
          {/if}
          {#if !item.isCurrent}
            <span class="text-foreground-muted" aria-hidden="true">/</span>
          {/if}
        </li>
      {/each}
    {/if}
  </ol>
</nav>