<script context="module" lang="ts">
  export interface SwitchButtonProps {
    id?: string;
    name?: string;
    value?: string;
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
  import { cn, cva, getChoiceState, bindControllerProps } from "./utils";

  export let disabled: SwitchButtonProps["disabled"] = false;
  export let className: SwitchButtonProps["className"] = "";
  export let onCheckedChange: SwitchButtonProps["onCheckedChange"];
  export let checked: SwitchButtonProps["checked"] = false;
  export let label: SwitchButtonProps["label"] = "Label";
  export let id: SwitchButtonProps["id"] = "switch-button";
  export let size: SwitchButtonProps["size"] = "medium";
  export let name: SwitchButtonProps["name"] = 'switch';
  export let value: SwitchButtonProps["value"] = 'on';
  export let leftLabel: SwitchButtonProps["leftLabel"] = false;
  export let rightLabel: SwitchButtonProps["rightLabel"] = false;
  $: props = { disabled, className, onCheckedChange, checked, label, id, size, name, value, leftLabel, rightLabel };
</script>

<span
  data-ctrl={typeof bindControllerProps}
  class={cn(
    "inline-flex items-center gap-2",
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    className
  )}
  on:click={(event) => {
    !disabled && onCheckedChange && onCheckedChange(!checked);
  }}
>
  {#if getChoiceState(props).showLeft}
    <span class="text-sm text-foreground-default">{label}</span>
  {/if}<button
    type="button"
    role="switch"
    {id}
    aria-checked={checked}
    aria-label={getChoiceState(props).hasLabel ? label : "Toggle setting"}
    {disabled}
    class={cn(
      "relative inline-flex shrink-0 items-center rounded-full shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-primary disabled:pointer-events-none",
      cva(
        size,
        {
          small: "h-5 w-9 p-0.5",
          medium: "h-6 w-11 p-0.5",
          large: "h-8 w-[52px] p-1",
        },
        "medium"
      ),
      checked ? "bg-primary-default" : "bg-background-interactive"
    )}
    ><span
      aria-hidden="true"
      class={cn(
        "inline-block rounded-full bg-background-default shadow-sm transition-transform",
        cva(
          size,
          {
            small: "h-4 w-4",
            medium: "h-5 w-5",
            large: "h-6 w-6",
          },
          "medium"
        ),
        checked
          ? cva(
              size,
              {
                small: "translate-x-4",
                medium: "translate-x-5",
                large: "translate-x-5",
              },
              "medium"
            )
          : "translate-x-0"
      )}
    /></button
  >
  {#if getChoiceState(props).showRight}
    <span class="text-sm text-foreground-default">{label}</span>
  {/if}</span
>