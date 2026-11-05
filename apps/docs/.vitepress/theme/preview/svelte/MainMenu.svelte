<script context="module" lang="ts">
  export interface MainMenuProps {
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

  export let active: MainMenuProps["active"] = false;
  export let className: MainMenuProps["className"] = "";
  export let onClick: MainMenuProps["onClick"];
  export let showLeadingIcon: MainMenuProps["showLeadingIcon"] = true;

  export let showLabel: MainMenuProps["showLabel"] = true;
  export let label: MainMenuProps["label"] = "Menu";
  export let showBadge: MainMenuProps["showBadge"] = false;
  export let badgeLabel: MainMenuProps["badgeLabel"] = "New";
  export let showTrailingIcon: MainMenuProps["showTrailingIcon"] = true;
</script>

<button
  type="button"
  data-ctrl={typeof bindControllerProps}
  aria-current={active ? "page" : undefined}
  class={cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary",
    active
      ? "bg-primary-subtle"
      : "hover:bg-background-muted active:bg-background-interactive",
    className
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
    >
      {#if $$slots.default}
        <slot />
      {/if}
      {#if !$$slots.default}
        <svg
          aria-hidden="true"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          ><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect
            x="14"
            y="3"
            width="7"
            height="7"
            rx="1.5"
          /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect
            x="14"
            y="14"
            width="7"
            height="7"
            rx="1.5"
          /></svg
        >
      {/if}</span
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