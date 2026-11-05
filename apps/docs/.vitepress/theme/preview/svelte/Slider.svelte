<script context="module" lang="ts">
  export interface SliderProps {
    id?: string;
    name?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    label?: string;
    showValue?: boolean;
    className?: string;
    onValueChange?: (value: number) => void;
  }
</script>

<script lang="ts">
  import { cn, getSliderState, bindControllerProps } from "./utils";

  export let className: SliderProps["className"] = "";
  export let showValue: SliderProps["showValue"] = false;
  export let label: SliderProps["label"] = "Slider";
  export let value: SliderProps["value"] = 0;
  export let disabled: SliderProps["disabled"] = false;
  export let id: SliderProps["id"] = "slider";
  export let name: SliderProps["name"] = "slider";
  export let min: SliderProps["min"] = 0;
  export let max: SliderProps["max"] = 100;
  export let step: SliderProps["step"] = 1;
  export let onValueChange: SliderProps["onValueChange"];
  function stringifyStyles(stylesObj) {
    let styles = "";
    for (let key in stylesObj) {
      const dashedKey = key.replace(/[A-Z]/g, function (match) {
        return "-" + match.toLowerCase();
      });
      styles += dashedKey + ":" + stylesObj[key] + ";";
    }
    return styles;
  }
  $: props = { className, showValue, label, value, disabled, id, name, min, max, step, onValueChange };
</script>

<div
  data-ctrl={typeof bindControllerProps}
  class={cn("flex w-full flex-col gap-2", className)}
>
  {#if showValue}
    <div
      class="flex items-center justify-between text-xs text-foreground-muted"
    >
      <span>{label}</span><span>{value}</span>
    </div>
  {/if}
  <div
    class={cn(
      "relative flex h-5 w-full items-center",
      disabled && "opacity-50"
    )}
  >
    <div class="absolute inset-x-0 h-1.5 rounded-full bg-background-muted" />
    <div
      style={stringifyStyles(getSliderState(props).barStyle)}
      class="absolute left-0 h-1.5 rounded-full bg-primary-default"
    />
    <input
      type="range"
      class="peer absolute inset-0 z-10 h-5 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      {id}
      {name}
      {min}
      {max}
      {step}
      {value}
      {disabled}
      aria-label={label}
      on:input={(event) => {
        !disabled && onValueChange && onValueChange(Number(event.target.value));
      }}
    />
    <div
      style={stringifyStyles(getSliderState(props).thumbStyle)}
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-background-default shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring-primary"
    />
  </div>
</div>