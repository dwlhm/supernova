<script context="module" lang="ts">
  export interface CheckboxProps {
    checked?: boolean;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    label?: string;
    leftLabel?: boolean;
    rightLabel?: boolean;
    name?: string;
    value?: string;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let size: CheckboxProps["size"] = "medium";
  export let label: CheckboxProps["label"] = "Label";
  export let disabled: CheckboxProps["disabled"] = false;
  export let onCheckedChange: CheckboxProps["onCheckedChange"];
  export let checked: CheckboxProps["checked"] = false;
  export let className: CheckboxProps["className"] = "";
  export let leftLabel: CheckboxProps["leftLabel"] = false;
  export let name: CheckboxProps["name"] = "checkbox";
  export let value: CheckboxProps["value"] = "";
  export let rightLabel: CheckboxProps["rightLabel"] = true;

  function handleChange() {
    if (disabled) {
      return;
    }
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  }
  $: boxClasses = () => {
    switch (size) {
      case "small":
        return "h-4 w-4 rounded-rounded-sm";
      case "large":
        return "h-6 w-6 rounded-rounded-lg";
      case "medium":
      default:
        return "h-5 w-5 rounded-rounded-md";
    }
  };
  $: iconClasses = () => {
    switch (size) {
      case "small":
        return "h-3 w-3";
      case "large":
        return "h-4 w-4";
      case "medium":
      default:
        return "h-3.5 w-3.5";
    }
  };
  $: gapClasses = () => {
    switch (size) {
      case "small":
        return "gap-1.5";
      case "large":
        return "gap-2.5";
      case "medium":
      default:
        return "gap-2";
    }
  };
  $: hasLabel = () => {
    return label !== "";
  };
</script>

<label
  class={cn(
    "inline-flex items-center",
    gapClasses(),
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    className
  )}
>
  {#if leftLabel && hasLabel()}
    <span
      class="text-sm text-components-checkbox-all-color-label-foreground-default"
      >{label}</span
    >
  {/if}<span class="relative inline-flex shrink-0 items-center justify-center"
    ><input
      type="checkbox"
      class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
      {name}
      {value}
      {checked}
      {disabled}
      aria-label={hasLabel() ? label : "Checkbox"}
      on:change={(event) => {
        handleChange();
      }}
    /><span
      aria-hidden="true"
      class={cn(
        "inline-flex items-center justify-center border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",
        boxClasses(),
        checked
          ? "border-components-checkbox-on-color-container-background-default bg-components-checkbox-on-color-container-background-default text-components-checkbox-on-color-icon-foreground-default"
          : "border-components-checkbox-off-color-container-border-default bg-components-checkbox-off-color-container-background-default"
      )}
    >
      {#if checked}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          class={cn("shrink-0", iconClasses())}
          ><path
            d="M5 13l4 4L19 7"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg
        >
      {/if}</span
    ></span
  >
  {#if rightLabel && hasLabel()}
    <span
      class="text-sm text-components-checkbox-all-color-label-foreground-default"
      >{label}</span
    >
  {/if}</label
>