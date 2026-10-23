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
    children?: any;
    onClick?: () => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let active: MenuItemProps["active"] = false;
  export let onClick: MenuItemProps["onClick"];
  export let className: MenuItemProps["className"] = "";
  export let showLeadingIcon: MenuItemProps["showLeadingIcon"] = true;
  export let showLabel: MenuItemProps["showLabel"] = true;
  export let label: MenuItemProps["label"] = "Menu";
  export let showBadge: MenuItemProps["showBadge"] = false;
  export let badgeLabel: MenuItemProps["badgeLabel"] = "New";
  export let showTrailingIcon: MenuItemProps["showTrailingIcon"] = true;

  function handleClick() {
    if (onClick) {
      onClick();
    }
  }
  $: containerClasses = () => {
    if (active) {
      return "bg-components-menu-item-active-color-container-background-active-rebind";
    }
    return "hover:bg-components-menu-item-hover-color-container-background-hover-rebind";
  };
  $: labelClasses = () => {
    return active
      ? "text-components-menu-item-active-color-label-foreground-active-rebind"
      : "text-components-menu-item-default-color-label-foreground-default-rebind";
  };
  $: iconClasses = () => {
    return active
      ? "text-components-menu-item-active-color-icon-foreground-active-rebind"
      : "text-components-menu-item-default-color-icon-foreground-default-rebind";
  };
  $: badgeClasses = () => {
    return active
      ? "bg-components-menu-item-active-color-badge-background-active-rebind text-components-menu-item-active-color-badge-label-foreground-active-rebind"
      : "bg-components-menu-item-default-color-badge-background-default-rebind text-components-menu-item-default-color-badge-label-foreground-default-rebind";
  };
  $: submenuBorderClasses = () => {
    return active
      ? "border-components-menu-item-active-color-submenu-content-border-active-rebind"
      : "border-border-default";
  };
</script>

<div class={cn("flex w-full flex-col", className)}>
  <button
    type="button"
    class={cn(
      "flex w-full items-center gap-2 rounded-rounded-md px-2 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
      containerClasses()
    )}
    on:click={(event) => {
      handleClick();
    }}
  >
    {#if showLeadingIcon}
      <span class={cn("flex shrink-0 items-center", iconClasses())}
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
      <span class={cn("flex-1 truncate text-left", labelClasses())}
        >{label}</span
      >
    {/if}
    {#if showBadge}
      <span
        class={cn(
          "inline-flex shrink-0 items-center rounded-rounded-xl px-2 py-0.5 text-xs font-medium leading-none",
          badgeClasses()
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
        class={cn("h-4 w-4 shrink-0", iconClasses())}
        ><path
          d="m9 6 6 6-6 6"
          stroke-linecap="round"
          stroke-linejoin="round"
        /></svg
      >
    {/if}</button
  >
  {#if $$slots.default}
    <div
      class={cn(
        "ml-4 flex flex-col gap-1 border-l py-1 pl-2",
        submenuBorderClasses()
      )}
    >
      <slot />
    </div>
  {/if}
</div>