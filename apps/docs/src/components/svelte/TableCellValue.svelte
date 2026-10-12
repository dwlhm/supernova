<script context="module" lang="ts">
  export interface TableCellValueProps {
    value?: string;
    secondaryValue?: string;
    badgeLabel?: string;
    statusLabel?: string;
    imageSrc?: string;
    avatarInitials?: string;
    href?: string;
    align?: "left" | "center" | "right";
    className?: string;
    children?: any;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let align: TableCellValueProps["align"] = "left";
  export let className: TableCellValueProps["className"] = "";
  export let imageSrc: TableCellValueProps["imageSrc"] = "";
  export let avatarInitials: TableCellValueProps["avatarInitials"] = "";
  export let href: TableCellValueProps["href"] = "";
  export let value: TableCellValueProps["value"] = "";
  export let secondaryValue: TableCellValueProps["secondaryValue"] = "";
  export let badgeLabel: TableCellValueProps["badgeLabel"] = "";
  export let statusLabel: TableCellValueProps["statusLabel"] = "";

  $: containerClasses = () => {
    switch (align) {
      case "center":
        return "justify-center";
      case "right":
        return "flex-row-reverse justify-start";
      case "left":
      default:
        return "justify-start";
    }
  };
  $: textAlignClasses = () => {
    switch (align) {
      case "center":
        return "items-center text-center";
      case "right":
        return "items-end text-right";
      case "left":
      default:
        return "items-start text-left";
    }
  };
</script>

<span
  class={cn("flex min-w-0 items-center gap-2", containerClasses(), className)}
>
  {#if imageSrc !== ""}
    <img
      alt=""
      class="h-8 w-8 shrink-0 rounded-rounded-sm object-cover"
      aria-hidden="true"
      src={imageSrc}
    />
  {/if}
  {#if avatarInitials !== ""}
    <span
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full bg-components-avatar-all-color-container-background-default text-xs font-medium uppercase text-components-avatar-all-color-initials-foreground-default"
      aria-hidden="true">{avatarInitials}</span
    >
  {/if}<span class={cn("flex min-w-0 flex-col gap-0.5", textAlignClasses())}>
    {#if href !== ""}
      <a
        class="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
        {href}>{value}</a
      >
    {/if}
    {#if href === "" && value !== ""}
      <span
        class="truncate text-sm text-components-table-default-color-cell-foreground-default"
        >{value}</span
      >
    {/if}
    {#if secondaryValue !== ""}
      <span
        class="truncate text-xs text-components-table-default-color-cell-foreground-muted"
        >{secondaryValue}</span
      >
    {/if}
    {#if badgeLabel !== ""}
      <span
        class="inline-flex w-fit items-center gap-1 rounded-rounded-full bg-components-badge-secondary-color-container-background-default px-2 py-0.5 text-xs font-medium leading-none text-components-badge-secondary-color-label-foreground-default"
        >{badgeLabel}</span
      >
    {/if}
    {#if statusLabel !== ""}
      <span
        class="inline-flex w-fit items-center gap-1 text-xs text-components-table-default-color-cell-foreground-muted"
        ><span
          class="h-1.5 w-1.5 shrink-0 rounded-rounded-full bg-components-avatar-all-color-status-background-online"
          aria-hidden="true"
        />{statusLabel}</span
      >
    {/if}</span
  >
  {#if $$slots.default}
    <slot />
  {/if}</span
>