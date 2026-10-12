<script context="module" lang="ts">
  export interface SidebarProps {
    expanded?: boolean;
    brand?: string;
    accountLabel?: string;
    accountMeta?: string;
    accountInitials?: string;
    brandInitials?: string;
    className?: string;
    children?: any;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let expanded: SidebarProps["expanded"] = true;
  export let accountLabel: SidebarProps["accountLabel"] = "Account";
  export let accountMeta: SidebarProps["accountMeta"] = "account@example.com";
  export let brand: SidebarProps["brand"] = "Komerce";
  export let className: SidebarProps["className"] = "";
  export let brandInitials: SidebarProps["brandInitials"] = "K";

  export let accountInitials: SidebarProps["accountInitials"] = "AB";

  $: widthClasses = () => {
    return expanded ? "w-60" : "w-16";
  };
  $: hasAccount = () => {
    return accountLabel !== "" || accountMeta !== "";
  };
</script>

<aside
  aria-label={brand}
  class={cn(
    "flex h-full shrink-0 flex-col justify-between border-r border-components-sidebar-expanded-rebind-color-container-border-default bg-components-sidebar-expanded-rebind-color-container-background-default pb-2",
    widthClasses(),
    className
  )}
>
  <div class="flex flex-col">
    <div
      class={cn(
        "flex items-center gap-2 px-2 py-4",
        expanded ? "" : "justify-center"
      )}
    >
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-md bg-components-sidebar-expanded-rebind-color-container-background-default-2 text-sm font-semibold text-components-sidebar-expanded-rebind-color-label-foreground-default-2"
        aria-hidden="true">{brandInitials}</span
      >
      {#if expanded}
        <span
          class="truncate text-sm font-semibold text-components-sidebar-expanded-rebind-color-label-foreground-default"
          >{brand}</span
        >
      {/if}
    </div>
    <nav aria-label="Main" class="flex flex-col gap-2 px-2"><slot /></nav>
  </div>
  {#if hasAccount()}
    <div class={cn("px-2", expanded ? "" : "flex justify-center")}>
      <div
        class={cn(
          "flex items-center gap-2 rounded-rounded-xl bg-background-subtle px-2 py-2",
          expanded ? "" : "justify-center"
        )}
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-background-muted text-xs font-medium text-components-sidebar-expanded-rebind-color-section-label-foreground-default"
          aria-hidden="true">{accountInitials}</span
        >
        {#if expanded}
          <span class="flex min-w-0 flex-col"
            ><span
              class="truncate text-sm font-medium text-components-sidebar-expanded-rebind-color-label-foreground-default"
              >{accountLabel}</span
            ><span
              class="truncate text-xs text-components-sidebar-expanded-rebind-color-section-label-foreground-default"
              >{accountMeta}</span
            ></span
          >
        {/if}
      </div>
    </div>
  {/if}
</aside>