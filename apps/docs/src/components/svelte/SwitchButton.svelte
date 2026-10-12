<script context="module" lang="ts">
  export interface SwitchButtonProps {
    checked?: boolean;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    label?: string;
    leftLabel?: boolean;
    rightLabel?: boolean;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let size: SwitchButtonProps["size"] = "medium";
  export let checked: SwitchButtonProps["checked"] = false;
  export let label: SwitchButtonProps["label"] = "Label";
  export let disabled: SwitchButtonProps["disabled"] = false;
  export let onCheckedChange: SwitchButtonProps["onCheckedChange"];
  export let className: SwitchButtonProps["className"] = "";
  export let leftLabel: SwitchButtonProps["leftLabel"] = false;
  export let rightLabel: SwitchButtonProps["rightLabel"] = true;

  function toggle() {
    if (disabled) {
      return;
    }
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  }
  $: trackClasses = () => {
    switch (size) {
      case "small":
        return "h-5 w-9 p-0.5";
      case "large":
        return "h-7 w-12 p-0.5";
      case "medium":
      default:
        return "h-6 w-11 p-0.5";
    }
  };
  $: thumbClasses = () => {
    switch (size) {
      case "small":
        return "h-4 w-4";
      case "large":
        return "h-6 w-6";
      case "medium":
      default:
        return "h-5 w-5";
    }
  };
  $: thumbTransform = () => {
    if (!checked) {
      return "translate-x-0";
    }
    switch (size) {
      case "small":
        return "translate-x-4";
      case "large":
        return "translate-x-5";
      case "medium":
      default:
        return "translate-x-5";
    }
  };
  $: trackColor = () => {
    return checked
      ? "bg-components-switch-on-color-track-background-default"
      : "bg-components-switch-off-color-track-background-default";
  };
  $: hasLabel = () => {
    return label !== "";
  };
</script>

<span
  class={cn(
    "inline-flex items-center gap-2",
    disabled && "opacity-50",
    className
  )}
>
  {#if leftLabel && hasLabel()}
    <span class="text-sm text-foreground-default">{label}</span>
  {/if}<button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={hasLabel() ? label : "Toggle setting"}
    {disabled}
    class={cn(
      "relative inline-flex shrink-0 items-center rounded-rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none",
      trackClasses(),
      trackColor()
    )}
    on:click={(event) => {
      toggle();
    }}
    ><span
      aria-hidden="true"
      class={cn(
        "inline-block rounded-rounded-full bg-components-switch-on-color-thumb-background-default shadow-sm transition-transform",
        thumbClasses(),
        thumbTransform()
      )}
    /></button
  >
  {#if rightLabel && hasLabel()}
    <span class="text-sm text-foreground-default">{label}</span>
  {/if}</span
>