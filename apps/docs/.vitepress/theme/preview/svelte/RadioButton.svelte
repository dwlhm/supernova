<script context="module" lang="ts">
  export interface RadioButtonProps {
    id?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
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
  import { cn, cva, getChoiceState, bindControllerProps } from "./utils";

  export let size: RadioButtonProps["size"] = "medium";
  export let disabled: RadioButtonProps["disabled"] = false;
  export let className: RadioButtonProps["className"] = "";
  export let label: RadioButtonProps["label"] = "Label";
  export let id: RadioButtonProps["id"] = "radio-button";
  export let name: RadioButtonProps["name"] = "radio-group";
  export let value: RadioButtonProps["value"] = "";
  export let checked: RadioButtonProps["checked"] = false;
  export let required: RadioButtonProps["required"] = false;
  export let onChange: RadioButtonProps["onChange"];
  export let leftLabel: RadioButtonProps["leftLabel"] = false;
  export let rightLabel: RadioButtonProps["rightLabel"] = false;
  $: props = { size, disabled, className, label, id, name, value, checked, required, onChange, leftLabel, rightLabel };
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
      type="radio"
      class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full opacity-0 disabled:cursor-not-allowed"
      {id}
      {name}
      {value}
      {checked}
      {disabled}
      {required}
      aria-label={!getChoiceState(props).showLeft &&
      !getChoiceState(props).showRight
        ? label || "Option"
        : undefined}
      on:change={(event) => {
        !disabled && onChange && onChange(value || label || "");
      }}
    /><span
      aria-hidden="true"
      class={cn(
        "inline-flex items-center justify-center rounded-full border bg-background-default shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary",
        cva(
          size,
          {
            small: "h-3 w-3",
            medium: "h-3.5 w-3.5",
            large: "h-4 w-4",
          },
          "medium"
        ),
        checked ? "border-primary-default" : "border-border-default"
      )}
    >
      {#if checked}
        <span
          class={cn(
            "rounded-full bg-primary-default",
            cva(
              size,
              {
                small: "h-1.5 w-1.5",
                medium: "h-2 w-2",
                large: "h-2.5 w-2.5",
              },
              "medium"
            )
          )}
        />
      {/if}</span
    ></span
  >
  {#if getChoiceState(props).showRight}
    <span class="text-sm text-foreground-default">{label}</span>
  {/if}</label
>