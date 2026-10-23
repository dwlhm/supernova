<script context="module" lang="ts">
  export interface RadioButtonProps {
    checked?: boolean;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    label?: string;
    leftLabel?: boolean;
    rightLabel?: boolean;
    name?: string;
    value?: string;
    className?: string;
    onChange?: (value: string) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";

  export let size: RadioButtonProps["size"] = "medium";
  export let label: RadioButtonProps["label"] = "Label";
  export let disabled: RadioButtonProps["disabled"] = false;
  export let onChange: RadioButtonProps["onChange"];
  export let value: RadioButtonProps["value"] = "";
  export let className: RadioButtonProps["className"] = "";
  export let leftLabel: RadioButtonProps["leftLabel"] = false;
  export let name: RadioButtonProps["name"] = "radio-group";
  export let checked: RadioButtonProps["checked"] = false;
  export let rightLabel: RadioButtonProps["rightLabel"] = true;

  function handleChange() {
    if (disabled) {
      return;
    }
    if (onChange) {
      onChange(value);
    }
  }
  $: circleClasses = () => {
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
  $: dotClasses = () => {
    switch (size) {
      case "small":
        return "h-1.5 w-1.5";
      case "large":
        return "h-2.5 w-2.5";
      case "medium":
      default:
        return "h-2 w-2";
    }
  };
  $: hasLabel = () => {
    return label !== "";
  };
</script>

<label
  class={cn(
    "inline-flex items-center gap-2",
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    className
  )}
>
  {#if leftLabel && hasLabel()}
    <span
      class="text-sm text-components-radio-button-all-color-label-foreground-default"
      >{label}</span
    >
  {/if}<span class="relative inline-flex shrink-0 items-center justify-center"
    ><input
      type="radio"
      class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-rounded-full opacity-0 disabled:cursor-not-allowed"
      {name}
      {value}
      {checked}
      {disabled}
      aria-label={hasLabel() ? label : "Option"}
      on:change={(event) => {
        handleChange();
      }}
    /><span
      aria-hidden="true"
      class={cn(
        "inline-flex items-center justify-center rounded-rounded-full border bg-components-radio-button-all-color-circle-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",
        circleClasses(),
        checked
          ? "border-components-radio-button-on-color-indicator-fill-default"
          : "border-components-radio-button-all-color-circle-border-default"
      )}
    >
      {#if checked}
        <span
          class={cn(
            "rounded-rounded-full bg-components-radio-button-on-color-indicator-fill-default",
            dotClasses()
          )}
        />
      {/if}</span
    ></span
  >
  {#if rightLabel && hasLabel()}
    <span
      class="text-sm text-components-radio-button-all-color-label-foreground-default"
      >{label}</span
    >
  {/if}</label
>