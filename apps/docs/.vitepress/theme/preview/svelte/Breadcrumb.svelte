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
  import { cn } from "./utils";

  export let items: BreadcrumbProps["items"] = [];
  export let type: BreadcrumbProps["type"] = "deep";
  export let maxItems: BreadcrumbProps["maxItems"] = 4;
  export let showEllipsis: BreadcrumbProps["showEllipsis"] = true;
  export let onNavigate: BreadcrumbProps["onNavigate"];
  export let className: BreadcrumbProps["className"] = "";

  function handleNavigate(href: string, index: number) {
    if (onNavigate && href !== "#") {
      onNavigate(href, index);
    }
  }
  $: visibleItems = () => {
    const all: BreadcrumbItem[] = items || [];
    const total = all.length;
    const rows: BreadcrumbEntry[] = [];
    if (total === 0) {
      return rows;
    }
    let startIndex = 0;
    const endIndex = total - 1;
    let collapsed = false;
    if (type === "1") {
      startIndex = total - 1;
    } else if (type === "2") {
      startIndex = total > 1 ? total - 2 : total - 1;
    } else {
      const limit = maxItems || 4;
      if (showEllipsis && total > limit) {
        collapsed = true;
      }
    }
    if (!collapsed) {
      for (let i = startIndex; i <= endIndex; i++) {
        rows.push({
          key: "crumb-" + i,
          label: all[i].label,
          href: all[i].href || "#",
          isEllipsis: false,
          isCurrent: i === endIndex,
        });
      }
      return rows;
    }
    rows.push({
      key: "crumb-first",
      label: all[0].label,
      href: all[0].href || "#",
      isEllipsis: false,
      isCurrent: false,
    });
    rows.push({
      key: "crumb-ellipsis",
      label: "...",
      href: "#",
      isEllipsis: true,
      isCurrent: false,
    });
    for (let i = endIndex - 1; i <= endIndex; i++) {
      rows.push({
        key: "crumb-" + i,
        label: all[i].label,
        href: all[i].href || "#",
        isEllipsis: false,
        isCurrent: i === endIndex,
      });
    }
    return rows;
  };
</script>

<nav aria-label="Breadcrumb" class={cn("w-full", className)}>
  <ol class="flex flex-wrap items-center gap-1.5 text-sm">
    {#each visibleItems() as item, index (item.key)}
      <li class="flex items-center gap-1.5">
        {#if item.isEllipsis}
          <span
            class="px-1 text-components-breadcrumb-all-color-item-foreground-default"
            aria-hidden="true">{item.label}</span
          >
        {/if}
        {#if !item.isEllipsis && item.isCurrent}
          <span
            aria-current="page"
            class="font-medium text-components-breadcrumb-all-color-current-page-foreground-default"
            >{item.label}</span
          >
        {/if}
        {#if !item.isEllipsis && !item.isCurrent}
          <a
            class="rounded-rounded-sm text-components-breadcrumb-all-color-item-foreground-default transition-colors hover:text-components-breadcrumb-all-color-current-page-foreground-default focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
            href={item.href}
            on:click={(event) => {
              handleNavigate(item.href, index);
            }}>{item.label}</a
          >
        {/if}
        {#if !item.isCurrent}
          <span
            class="text-components-breadcrumb-all-color-separator-stroke-default"
            aria-hidden="true"
          >
            /
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>