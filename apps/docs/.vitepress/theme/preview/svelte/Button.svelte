<script context="module" lang="ts">
  export interface ButtonProps {
    label?: string;
    type?: "button" | "submit" | "reset";
    variant?:
      | "primary"
      | "secondary"
      | "outline"
      | "ghost"
      | "destructive"
      | "link";
    size?: "large" | "regular" | "small" | "mini";
    roundness?: "default" | "round";
    disabled?: boolean;
    showLabel?: boolean;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
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

  export let type: ButtonProps["type"] = "button";
  export let disabled: ButtonProps["disabled"] = false;
  export let ariaLabel: ButtonProps["ariaLabel"] = "";
  export let showLabel: ButtonProps["showLabel"] = true;
  export let label: ButtonProps["label"] = "Label";
  export let variant: ButtonProps["variant"] = "primary";
  export let size: ButtonProps["size"] = "regular";
  export let roundness: ButtonProps["roundness"] = "default";
  export let className: ButtonProps["className"] = "";
  export let onClick: ButtonProps["onClick"];
  export let showLeftIcon: ButtonProps["showLeftIcon"] = false;

  export let showRightIcon: ButtonProps["showRightIcon"] = false;
</script>

<button
  type={type || "button"}
  {disabled}
  aria-disabled={disabled}
  aria-label={ariaLabel !== "" ? ariaLabel : !showLabel ? label : undefined}
  class={cn(
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:opacity-50 disabled:pointer-events-none",
    cva(
      variant,
      {
        primary:
          "bg-primary-default text-primary-foreground shadow-xs hover:bg-primary-hover active:bg-primary-pressed",
        secondary:
          "bg-secondary-default text-secondary-foreground shadow-xs hover:bg-secondary-hover active:bg-background-interactive focus-visible:bg-secondary-hover",
        outline:
          "border border-border-default bg-background-default text-foreground-default shadow-xs hover:bg-background-muted active:bg-background-interactive focus-visible:border-primary-border-emphasis",
        ghost: "bg-ghost-default text-foreground-default hover:bg-ghost-hover",
        destructive:
          "bg-destructive-background text-primary-foreground shadow-xs hover:bg-destructive-hover active:bg-destructive-pressed focus-visible:ring-focus-ring-error",
        link: "bg-ghost-default text-primary-muted underline-offset-4 hover:underline hover:text-primary-on-surface",
      },
      "primary"
    ),
    cva(
      size,
      {
        large: "h-10 px-6 text-base gap-2",
        regular: "h-9 px-4 text-sm gap-2",
        small: "h-8 px-3 text-sm gap-1.5",
        mini: "h-6 px-2 text-xs gap-1.5",
      },
      "regular"
    ),
    roundness === "round" ? "rounded-full" : "rounded-lg",
    className
  )}
  on:click={(event) => {
    !disabled && onClick && onClick();
  }}
>
  {#if showLeftIcon}
    <svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><path stroke-linecap="round" d={ICON_PATHS.plus} /></svg
    >
  {/if}
  {#if showLabel && (!$$slots.default || label !== "Label")}
    <span class="truncate">{label}</span>
  {/if}<slot />
  {#if showRightIcon}
    <svg
      aria-hidden="true"
      class="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={ICON_PATHS.arrowRight}
      /></svg
    >
  {/if}</button
>