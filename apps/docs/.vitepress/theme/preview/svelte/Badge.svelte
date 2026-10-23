<script context="module" lang="ts">
  export interface BadgeProps {
    label?: string;
    variant?:
      | "primary"
      | "secondary"
      | "destructive"
      | "success"
      | "warning"
      | "info"
      | "outline";
    className?: string;
    children?: any;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let variant: BadgeProps["variant"] = "primary";
  export let className: BadgeProps["className"] = "";

  export let label: BadgeProps["label"] = "Badge";

  $: variantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-components-badge-secondary-color-container-background-default text-components-badge-secondary-color-label-foreground-default";
      case "destructive":
        return "bg-components-badge-destructive-color-container-background-default text-components-badge-destructive-color-label-foreground-default";
      case "success":
        return "bg-components-badge-success-color-container-background-default text-components-badge-success-color-label-foreground-default";
      case "warning":
        return "bg-components-badge-warning-color-container-background-default text-components-badge-warning-color-label-foreground-default";
      case "info":
        return "bg-components-badge-info-color-container-background-default text-components-badge-info-color-label-foreground-default";
      case "outline":
        return "bg-components-badge-outline-color-container-background-default text-components-badge-outline-color-label-foreground-default border border-components-badge-outline-color-container-border-default";
      case "primary":
      default:
        return "bg-components-badge-primary-color-container-background-default text-components-badge-primary-color-label-foreground-default";
    }
  };
</script>

<span
  class={cn(
    "inline-flex max-w-full items-center gap-1 rounded-rounded-full px-2 py-0.5 text-xs font-medium leading-none",
    variantClasses(),
    className
  )}
>
  {#if $$slots.default}
    <slot />
  {:else}
    <span class="truncate">{label}</span>
  {/if}</span
>