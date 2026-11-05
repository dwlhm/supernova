<script context="module" lang="ts">
  export interface SidebarProps {
    expanded?: boolean;
    brand?: string;
    accountLabel?: string;
    accountMeta?: string;
    accountInitials?: string;
    brandInitials?: string;
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, bindControllerProps } from "./utils";

  export let brand: SidebarProps["brand"] = "Komerce";
  export let expanded: SidebarProps["expanded"] = false;
  export let className: SidebarProps["className"] = "";
  export let brandInitials: SidebarProps["brandInitials"] = "K";

  export let accountLabel: SidebarProps["accountLabel"] = "Lionel Messi";
  export let accountMeta: SidebarProps["accountMeta"] = "messi@gmail.com";
  export let accountInitials: SidebarProps["accountInitials"] = "LM";
</script>

<aside
  data-ctrl={typeof bindControllerProps}
  aria-label={brand}
  class={cn(
    "flex h-full shrink-0 flex-col justify-between border-r border-border-default bg-background-default pb-2",
    expanded ? "w-60" : "w-16",
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
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-default text-sm font-semibold text-primary-foreground"
        aria-hidden="true">{brandInitials}</span
      >
      {#if expanded}
        <span class="truncate text-sm font-semibold text-foreground-default"
          >{brand}</span
        >
      {/if}
    </div>
    <nav aria-label="Main" class="flex flex-col gap-2 px-2"><slot /></nav>
  </div>
  {#if accountLabel !== "" || accountMeta !== ""}
    <div class={cn("px-2", expanded ? "" : "flex justify-center")}>
      <div
        class={cn(
          "flex items-center gap-2 rounded-xl bg-background-muted px-2 py-2",
          expanded ? "" : "justify-center"
        )}
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-subtle text-xs font-medium text-foreground-muted"
          aria-hidden="true">{accountInitials}</span
        >
        {#if expanded}
          <span class="flex min-w-0 flex-col"
            ><span class="truncate text-sm font-medium text-foreground-default"
              >{accountLabel}</span
            ><span class="truncate text-xs text-foreground-muted"
              >{accountMeta}</span
            ></span
          >
        {/if}
      </div>
    </div>
  {/if}
</aside>