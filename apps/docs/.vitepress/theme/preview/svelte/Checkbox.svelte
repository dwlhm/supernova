<script context="module" lang="ts">
  export interface CheckboxProps {
    id?: string;
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    required?: boolean;
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
  import {
    cn,
    cva,
    getChoiceState,
    ICON_PATHS,
    bindControllerProps,
  } from "./utils";

  export let size: CheckboxProps["size"] = "medium";
  export let disabled: CheckboxProps["disabled"] = false;
  export let className: CheckboxProps["className"] = "";
  export let label: CheckboxProps["label"] = "Label";
  export let id: CheckboxProps["id"] = "checkbox";
  export let name: CheckboxProps["name"] = "checkbox";
  export let value: CheckboxProps["value"] = "";
  export let checked: CheckboxProps["checked"] = false;
  export let required: CheckboxProps["required"] = false;
  export let indeterminate: CheckboxProps["indeterminate"] = false;
  export let onCheckedChange: CheckboxProps["onCheckedChange"];
  export let leftLabel: CheckboxProps["leftLabel"] = false;
  export let rightLabel: CheckboxProps["rightLabel"] = false;
  $: props = { size, disabled, className, label, id, name, value, checked, required, indeterminate, onCheckedChange, leftLabel, rightLabel };
</script>

<label
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "inline-flex items-center",
    cva(
      size,
      {
        small: "gap-1.5",
        medium: "gap-2",
        large: "gap-2.5",
      },
      "medium"
    ),
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    className
  )}
>
  {#if getChoiceState(props).showLeft}
    <span class="text-sm text-foreground-default">{label}</span>
  {/if}<span class="relative inline-flex shrink-0 items-center justify-center"
    ><input
      type="checkbox"
      class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
      {id}
      {name}
      {value}
      {checked}
      {disabled}
      {required}
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={!getChoiceState(props).showLeft &&
      !getChoiceState(props).showRight
        ? label || "Checkbox"
        : undefined}
      on:change={(event) => {
        !disabled && onCheckedChange && onCheckedChange(!checked);
      }}
    /><span
      aria-hidden="true"
      class={cn(
        "inline-flex items-center justify-center rounded-sm border shadow-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",
        cva(
          size,
          {
            small: "h-3.5 w-3.5",
            medium: "h-4 w-4",
            large: "h-5 w-5",
          },
          "medium"
        ),
        checked || indeterminate
          ? "border-primary-default bg-primary-default text-primary-foreground"
          : "border-border-default bg-background-default"
      )}
    >
      {#if checked || indeterminate}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          class={cn(
            "shrink-0",
            cva(
              size,
              {
                small: "h-2.5 w-2.5",
                medium: "h-3 w-3",
                large: "h-3.5 w-3.5",
              },
              "medium"
            )
          )}
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d={indeterminate ? ICON_PATHS.minus : ICON_PATHS.check}
          /></svg
        >
      {/if}</span
    ></span
  >
  {#if getChoiceState(props).showRight}
    <span class="text-sm text-foreground-default">{label}</span>
  {/if}</label
>