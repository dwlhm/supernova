<script context="module" lang="ts">
  export interface FABProps {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "outline";
    size?: "small" | "regular" | "large" | "extended";
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;

    onClick?: () => void;
  }
</script>

<script lang="ts">
  interface $$Slots {
    default: Record<string, never>;
  }
  import { cn, cva, ICON_PATHS } from "./utils";

  export let type: FABProps["type"] = "button";
  export let ariaLabel: FABProps["ariaLabel"] = "Action";
  export let disabled: FABProps["disabled"] = false;
  export let variant: FABProps["variant"] = "primary";
  export let size: FABProps["size"] = "small";
  export let className: FABProps["className"] = "";
  export let onClick: FABProps["onClick"];
</script>

<button
  type={type || "button"}
  aria-label={ariaLabel || "Action"}
  {disabled}
  class={cn(
    "inline-flex shrink-0 items-center justify-center rounded-full shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none disabled:opacity-50",
    cva(
      variant,
      {
        primary:
          "bg-primary-default text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed",
        secondary:
          "bg-secondary-default text-secondary-foreground hover:bg-secondary-hover active:bg-background-interactive",
        outline:
          "border border-border-default bg-background-default text-foreground-default hover:bg-background-muted active:bg-background-interactive",
      },
      "primary"
    ),
    cva(
      size,
      {
        small: "h-10 w-10",
        regular: "h-14 w-14",
        large: "h-24 w-24",
        extended: "h-14 w-auto gap-3 px-4",
      },
      "small"
    ),
    className
  )}
  on:click={(event) => {
    !disabled && onClick && onClick();
  }}
  ><svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    class={cn(
      "shrink-0",
      cva(
        size,
        {
          small: "h-4 w-4",
          regular: "h-5 w-5",
          large: "h-7 w-7",
          extended: "h-5 w-5",
        },
        "small"
      )
    )}><path stroke-linecap="round" d={ICON_PATHS.plus} /></svg
  >
  {#if size === "extended"}
    <span class="truncate text-sm font-medium"><slot /></span>
  {/if}</button
>