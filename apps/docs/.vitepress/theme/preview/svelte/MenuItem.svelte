<script context="module" lang="ts">
  export interface MenuItemProps {
    label?: string;
    active?: boolean;
    showLabel?: boolean;
    showLeadingIcon?: boolean;
    showTrailingIcon?: boolean;
    showBadge?: boolean;
    badgeLabel?: string;
    className?: string;

    onClick?: () => void;
  }
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, ICON_PATHS, bindControllerProps } from "./utils";

  export let className: MenuItemProps["className"] = "";
  export let active: MenuItemProps["active"] = false;
  export let onClick: MenuItemProps["onClick"];
  export let showLeadingIcon: MenuItemProps["showLeadingIcon"] = true;
  export let showLabel: MenuItemProps["showLabel"] = true;
  export let label: MenuItemProps["label"] = "Menu";
  export let showBadge: MenuItemProps["showBadge"] = false;
  export let badgeLabel: MenuItemProps["badgeLabel"] = "New";
  export let showTrailingIcon: MenuItemProps["showTrailingIcon"] = true;
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn("flex w-full flex-col", className)}
>
  <button
    type="button"
    aria-current={active ? "page" : undefined}
    class={cn(
      "flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
      active
        ? "bg-primary-subtle font-medium"
        : "hover:bg-background-muted active:bg-background-interactive"
    )}
    on:click={(event) => {
      onClick && onClick();
    }}
  >
    {#if showLeadingIcon}
      <span
        class={cn(
          "flex shrink-0 items-center",
          active ? "text-primary-subtle-foreground" : "text-foreground-default"
        )}
        ><svg
          aria-hidden="true"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="9" /></svg
        ></span
      >
    {/if}
    {#if showLabel}
      <span
        class={cn(
          "flex-1 truncate text-left",
          active ? "text-primary-subtle-foreground" : "text-foreground-default"
        )}>{label}</span
      >
    {/if}
    {#if showBadge}
      <span
        class={cn(
          "inline-flex shrink-0 items-center rounded-xl px-2 py-0.5 text-xs font-medium leading-none",
          active
            ? "bg-primary-default text-primary-foreground"
            : "bg-primary-subtle text-primary-subtle-foreground"
        )}>{badgeLabel}</span
      >
    {/if}
    {#if showTrailingIcon}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class={cn(
          "h-4 w-4 shrink-0",
          active ? "text-primary-subtle-foreground" : "text-foreground-muted"
        )}
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d={ICON_PATHS.chevronRight}
        /></svg
      >
    {/if}</button
  >
  {#if $$slots.default}
    <div
      class={cn(
        "ml-4 flex flex-col gap-1 border-l py-1 pl-2",
        active ? "border-primary-default" : "border-border-default"
      )}
    >
      <slot />
    </div>
  {/if}
</div>