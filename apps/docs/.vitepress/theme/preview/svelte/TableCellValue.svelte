<script context="module" lang="ts">
  export interface TableCellValueProps {
    value?: string;
    secondaryValue?: string;
    badgeLabel?: string;
    buttonLabel?: string;
    statusLabel?: string;
    imageSrc?: string;
    avatarInitials?: string;
    href?: string;
    align?: "left" | "center" | "right";
    className?: string;
}
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, bindControllerProps } from "./utils";
  import Badge from "./Badge.svelte";
  import Button from "./Button.svelte";

  export let align: TableCellValueProps["align"] = "left";
  export let className: TableCellValueProps["className"] = "";
  export let imageSrc: TableCellValueProps["imageSrc"] = "";
  export let avatarInitials: TableCellValueProps["avatarInitials"] = "";
  export let badgeLabel: TableCellValueProps["badgeLabel"] = "";
  export let buttonLabel: TableCellValueProps["buttonLabel"] = "";
  export let href: TableCellValueProps["href"] = "";
  export let value: TableCellValueProps["value"] = "Cell Value";
  export let secondaryValue: TableCellValueProps["secondaryValue"] = "";
  export let statusLabel: TableCellValueProps["statusLabel"] = "";
</script>

<span
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "flex min-w-0 items-center gap-2",
    cva(
      align,
      {
        left: "justify-start",
        center: "justify-center",
        right: "flex-row-reverse justify-start",
      },
      "left"
    ),
    className
  )}
>
  {#if imageSrc === "placeholder"}
    <span
      class="h-7 w-7 shrink-0 rounded bg-background-muted"
      aria-hidden="true"
    />
  {/if}
  {#if imageSrc !== "" && imageSrc !== "placeholder"}
    <img
      alt=""
      class="h-7 w-7 shrink-0 rounded object-cover"
      aria-hidden="true"
      src={imageSrc}
    />
  {/if}
  {#if avatarInitials !== ""}
    <span
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-muted text-xs font-medium uppercase text-foreground-subtle"
      aria-hidden="true">{avatarInitials}</span
    >
  {/if}
  {#if badgeLabel !== ""}
    <Badge variant="primary" label={badgeLabel} />
  {/if}
  {#if buttonLabel !== ""}
    <Button variant="primary" size="small" label={buttonLabel} />
  {/if}
  {#if badgeLabel === "" && buttonLabel === ""}
    <span
      class={cn(
        "flex min-w-0 flex-col gap-0.5",
        cva(
          align,
          {
            left: "items-start text-left",
            center: "items-center text-center",
            right: "items-end text-right",
          },
          "left"
        )
      )}
    >
      {#if href !== ""}
        <a
          class="truncate text-sm font-medium text-primary-default underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary"
          {href}>{value}</a
        >
      {/if}
      {#if href === "" && value !== ""}
        <span class="truncate text-sm text-foreground-default">{value}</span>
      {/if}
      {#if secondaryValue !== ""}
        <span class="truncate text-xs text-foreground-muted"
          >{secondaryValue}</span
        >
      {/if}
      {#if statusLabel !== ""}
        <span
          class="inline-flex w-fit items-center gap-1 text-xs text-foreground-muted"
          ><span
            class="h-1.5 w-1.5 shrink-0 rounded-full bg-success-default"
            aria-hidden="true"
          />{statusLabel}</span
        >
      {/if}</span
    >
  {/if}
  {#if $$slots.default}
    <slot />
  {/if}</span
>